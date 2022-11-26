package minechain.events;

import com.sk89q.worldguard.protection.regions.ProtectedRegion;
import java.util.Map;
import java.util.UUID;
import minechain.utils.RegionUtils;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class AllocateChunk extends Event {

  private static final HandlerList HANDLERS = new HandlerList();

  private ProtectedRegion region;
  private Map user;

  public AllocateChunk(Map user, String tokenId) {
    this.user = user;
    this.region = RegionUtils.getRegionById(tokenId);
  }

  public ProtectedRegion getRegion() {
    return region;
  }

  public Map getUser() {
    return user;
  }

  public static HandlerList getHandlerList() {
    return HANDLERS;
  }

  @Override
  public HandlerList getHandlers() {
    return HANDLERS;
  }
}
