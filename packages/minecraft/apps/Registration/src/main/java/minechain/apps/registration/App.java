package minechain.apps.registration;

import com.google.gson.Gson;
import java.util.LinkedHashMap;
import java.util.Map;
import minechain.libs.rabbit.Rabbit;
import org.bukkit.GameMode;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerMoveEvent;
import org.bukkit.event.player.PlayerRespawnEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.scheduler.BukkitRunnable;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    getServer().getPluginManager().registerEvents(this, this);
    Rabbit.getInstance().registerExchange(new RegistrationExchange(this));
  }

  @Override
  public void onDisable() {
    Rabbit.getInstance().close();
  }

  @EventHandler
  public void onPlayerMove(PlayerMoveEvent e) {
    e.setCancelled(true);
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent playerJoinEvent) {
    Player player = playerJoinEvent.getPlayer();
    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();
    stringMap.put("uuid", player.getUniqueId().toString());
    Rabbit.getInstance().publish("minecraft", "playerJoin", gson.toJson(stringMap));
  }

  @EventHandler
  public void onPlayerSpawn(PlayerRespawnEvent e) {
    var player = e.getPlayer();

    new BukkitRunnable() {
      @Override
      public void run() {
        player.addPotionEffect(new PotionEffect(PotionEffectType.DARKNESS, 1000000000, 10));
        player.addPotionEffect(new PotionEffect(PotionEffectType.BLINDNESS, 1000000000, 10));
        player.setGameMode(GameMode.SPECTATOR);
      }
    }
      .runTaskLater(this, 30);
  }
}
