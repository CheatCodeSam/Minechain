package minechain.apps.minechainmain.events;

import java.util.Map;
import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class AuthorizedJoin extends Event {

  private static final HandlerList HANDLERS = new HandlerList();

  private Map user;

  public AuthorizedJoin(Map user) {
    this.user = user;
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
