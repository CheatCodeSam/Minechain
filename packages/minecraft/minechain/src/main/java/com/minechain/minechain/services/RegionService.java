package com.minechain.minechain.services;

import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.types.Region;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;

@Singleton
public class RegionService {
    private JavaPlugin app;
    private Region[] regions;

    @Inject
    public RegionService(JavaPlugin app) {
        this.app = app;

        var container = WorldGuard.getInstance().getPlatform().getRegionContainer();

        var world = Bukkit.getServer().getWorld("world");
        var regions = container.get(BukkitAdapter.adapt(world));

        if (regions != null) {
            for (var regionId : regions.getRegions().keySet()) {
                regions.removeRegion(regionId);
            }

            Integer index = 0;
            this.regions = new Region[1024];

            for (Integer y = -16; y < 16; y++) {
                for (Integer x = -16; x < 16; x++) {
                    var min = BlockVector3.at(x * 16, -64, y * 16);
                    var max = BlockVector3.at(x * 16 + 15, 319, y * 16 + 15);
                    var region = new Region(min, max, world, index);
                    regions.addRegion(region.getRegion());
                    this.regions[index] = region;
                    index++;
                }
            }
        } else {
            throw new NullPointerException("Regions not found, is WorldGuard installed?");
        }
    }

    public void updateOwner(Integer tokenId, UUID userId) {
        this.runOnMainThread(() -> {
            var reg = this.regions[tokenId];
            reg.updateOwner(userId);
        });
    }

    public void setGhostProperty(Integer tokenId) {
        this.runOnMainThread(() -> {
            var reg = this.regions[tokenId];
            reg.setGhostProperty();
        });
    }

    public void updateScoreBoard(Integer tokenId, String displayName, String price) {
        this.runOnMainThread(() -> {
            var reg = this.regions[tokenId];
            reg.updateScoreBoard(displayName, price);
        });
    }

    public void emitFireworks(Integer tokenId) {
        this.runOnMainThread(() -> {
            this.regions[tokenId].emitFirework();
        }, 20);
    }

    private void runOnMainThread(Runnable task, long i) {
        Bukkit.getScheduler().runTaskLater(app, task, i);
    }

    private void runOnMainThread(Runnable task) {
        Bukkit.getScheduler().runTaskLater(app, task, 0);
    }

    public String[][] getRegionBlocks(Integer tokenId) {
        return this.regions[tokenId].getHighestBlocks();
    }

}
