package minechain.apps.minechainmain.utils;

import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.regions.ProtectedRegion;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

public class RegionUtils {

  public static ProtectedRegion getPlayerRegion(Player player) {
    var location = BukkitAdapter.adapt(player.getLocation());
    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();
    var query = container.createQuery();
    var set = query.getApplicableRegions(location);
    ProtectedRegion retVal = null;
    for (var region : set) retVal = region;
    return retVal;
  }

  public static ProtectedRegion getRegionById(String id) {
    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();
    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));
    if (regions != null) {
      var reg = regions.getRegion(id);
      return reg;
    }
    return null;
  }

  public static void teleportPlayerToRegion(Player player, ProtectedRegion region) {
    var topX = region.getMaximumPoint().getX();
    var topZ = region.getMaximumPoint().getZ();
    player.teleport(player.getWorld().getHighestBlockAt(topX, topZ).getLocation());
  }
}
