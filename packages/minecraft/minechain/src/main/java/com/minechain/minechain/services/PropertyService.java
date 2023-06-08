package com.minechain.minechain.services;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.types.Region;
import com.minechain.minechain.types.RepossessedDto;
import com.minechain.minechain.types.SoldDto;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;

@Singleton
public class PropertyService {

  private Region[] properties;
  private JavaPlugin app;

  @Inject
  public PropertyService(JavaPlugin app) {
    this.app = app;

    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();

    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));

    if (regions != null) {
      for (var regionId : regions.getRegions().keySet()) {
        regions.removeRegion(regionId);
      }

      Integer index = 0;

      this.properties = new Region[1024];

      for (Integer y = -16; y < 16; y++) {
        for (Integer x = -16; x < 16; x++) {
          var min = BlockVector3.at(x * 16, -64, y * 16);
          var max = BlockVector3.at(x * 16 + 15, 319, y * 16 + 15);
          var region = new Region(min, max, world, index);
          regions.addRegion(region.getRegion());
          this.properties[index] = region;
          index++;
        }
      }
    } else {
      throw new NullPointerException("Regions not found, is WorldGuard installed?");
    }
  }

  public void sold(SoldDto soldDto) {
    var property = this.properties[soldDto.getTokenId()];
    if (soldDto.hasLinkedAccount()) {
      property.updateOwner(soldDto.getLinkedAccount());
    } else {
      property.setGhostProperty(soldDto.getTo());
    }

    new BukkitRunnable() {
      @Override
      public void run() {
        property.updateScoreBoard(soldDto.getTokenId(), soldDto.getOwnerDisplayName(), soldDto.getPrice());
        property.emitFirework();
      }
    }.runTaskLater(this.app, 20);

  }

  public void repossessed(RepossessedDto repossessedDto) {
    var property = this.properties[repossessedDto.getTokenId()];
    property.setGhostProperty(repossessedDto.getTo());
  }

}
