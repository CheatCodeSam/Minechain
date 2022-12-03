package minechain.apps.minechainmain.events;

import com.sk89q.worldguard.protection.regions.ProtectedRegion;
import minechain.apps.minechainmain.dtos.MinechainUser;
import minechain.apps.minechainmain.utils.RegionUtils;
import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class AllocateChunk extends Event {

  private static final HandlerList HANDLERS = new HandlerList();

  private ProtectedRegion region;
  private MinechainUser user;

  public AllocateChunk(MinechainUser user, String tokenId) {
    this.user = user;
    this.region = RegionUtils.getRegionById(tokenId);
  }

  public ProtectedRegion getRegion() {
    return region;
  }

  public MinechainUser getUser() {
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
