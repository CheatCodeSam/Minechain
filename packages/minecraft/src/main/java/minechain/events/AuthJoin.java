package minechain.events;

import java.util.Map;
import org.bukkit.entity.Player;
import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class AuthJoin extends Event {

  private static final HandlerList HANDLERS = new HandlerList();
  private Map details;

  private Player player;

  public AuthJoin(Player player, Map details) {
    this.player = player;
    this.details = details;
  }

  public Map getDetails() {
    return details;
  }

  public Player getPlayer() {
    return player;
  }

  public static HandlerList getHandlerList() {
    return HANDLERS;
  }

  @Override
  public HandlerList getHandlers() {
    return HANDLERS;
  }
}
