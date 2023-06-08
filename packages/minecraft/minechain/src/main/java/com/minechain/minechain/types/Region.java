package com.minechain.minechain.types;

import java.util.UUID;

import org.bukkit.World;

import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.domains.DefaultDomain;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;

public class Region {

    private BlockVector3 min;
    private BlockVector3 max;
    private Integer index;

    private ProtectedCuboidRegion region;
    private World world;

    public Region(BlockVector3 min, BlockVector3 max, World world, Integer index) {
        this.world = world;
        this.min = min;
        this.index = index;
        this.max = max;
        this.region = new ProtectedCuboidRegion(String.valueOf(index), min, max);
        this.region.setFlag(Flags.DENY_MESSAGE, "");
    }

    public ProtectedCuboidRegion getRegion() {
        return region;
    }

    public void updateOwner(UUID owner) {
        var playerDomain = new DefaultDomain();
        playerDomain.addPlayer(owner);
        region.setOwners(playerDomain);
    }

    public String[][] getHighestBlocks() {
        Integer width = Math.abs(this.min.getBlockX() - this.max.getBlockX());
        Integer length = Math.abs(this.min.getBlockZ() - this.max.getBlockZ());
        var highestBlocks = new String[width][length];
        for (Integer x = 0; x < width; x++) {
            for (Integer z = 0; z < length; z++) {
                Integer worldX = this.min.getBlockX() + x;
                Integer worldZ = this.min.getBlockZ() + z;
                var highestBlock = this.world.getHighestBlockAt(worldX, worldZ);
                var type = highestBlock.getType();
                highestBlocks[x][z] = type.toString();
            }
        }
        return highestBlocks;
    }

    public Integer getIndex() {
        return index;
    }

}
