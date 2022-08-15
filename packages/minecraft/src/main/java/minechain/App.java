package minechain;

import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    // Registers the event handlers. Scans this class for all "EventHandler" annotations
    Bukkit.getPluginManager().registerEvents(this, this);

    Bukkit.broadcastMessage("AWS Manager Pluggin Started!");
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent playerJoinEvent) {
    Bukkit.broadcastMessage(playerJoinEvent.getPlayer().getDisplayName() + " has joined!");
  }
}
