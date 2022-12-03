package minechain.apps.minechainmain.events;

import minechain.apps.minechainmain.dtos.MinechainUser;
import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class AuthorizedJoin extends Event {

  private static final HandlerList HANDLERS = new HandlerList();

  private MinechainUser user;

  public AuthorizedJoin(MinechainUser user) {
    this.user = user;
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
