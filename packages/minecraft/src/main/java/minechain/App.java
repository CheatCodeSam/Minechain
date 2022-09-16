package minechain;

import com.google.gson.Gson;
import java.util.LinkedHashMap;
import java.util.Map;
import minechain.channels.RegistrationExchange;
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

    Rabbit.getInstance().registerExchange(new RegistrationExchange());
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent playerJoinEvent) {
    Player player = playerJoinEvent.getPlayer();
    player.getUniqueId();
    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();

    stringMap.put("uuid", player.getUniqueId().toString());
    stringMap.put("displayName", player.getName());
    System.out.println(player.getDisplayName());

    Rabbit.getInstance().publish("registration", "playerJoin", gson.toJson(stringMap));
  }
}
