package com.minechain.minechain.types;

import java.util.UUID;

import org.bukkit.entity.Player;

import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.domains.DefaultDomain;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;

public class Region {

    private BlockVector3 min;
    private BlockVector3 max;
    private Integer index;

    private ProtectedCuboidRegion region;

    public Region(BlockVector3 min, BlockVector3 max, Integer index) {
        this.min = min;
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
}
