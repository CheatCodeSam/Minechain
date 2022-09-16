package minechain;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;
import minechain.channels.Exchange;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);
    this.getCommand("mq").setExecutor(new CommandMq());

    Rabbit.getInstance();

    Rabbit.getInstance().registerExchange(new Exchange("registration", "direct", true));
    try {
      Rabbit.getInstance().join();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent playerJoinEvent) {
    Player player = playerJoinEvent.getPlayer();
    player.getUniqueId();
    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();

    stringMap.put("uuid", player.getUniqueId().toString());
    stringMap.put("displayName", player.getName());

    Rabbit.getInstance().publish("registration", "playerJoin", gson.toJson(stringMap));
  }
}
