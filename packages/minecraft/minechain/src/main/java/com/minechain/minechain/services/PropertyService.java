package com.minechain.minechain.services;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.types.Region;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;

@Singleton
public class PropertyService {
  @Inject
  public PropertyService(JavaPlugin app) {

    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();

    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));

    if (regions != null) {
      for (var regionId : regions.getRegions().keySet()) {
        regions.removeRegion(regionId);
      }

      Integer index = 0;

      for (Integer y = -16; y < 16; y++) {
        for (Integer x = -16; x < 16; x++) {
          var min = BlockVector3.at(x * 16, -64, y * 16);
          var max = BlockVector3.at(x * 16 + 15, 319, y * 16 + 15);
          var region = new Region(min, max, index);
          regions.addRegion(region.getRegion());
          index++;
        }
      }
    }

  }
}
