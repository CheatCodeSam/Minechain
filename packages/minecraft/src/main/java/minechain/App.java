package minechain;

import com.google.gson.Gson;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;
import java.util.LinkedHashMap;
import java.util.Map;
import minechain.exchange.MinecraftExchange;
import minechain.exchange.RegistrationExchange;
import net.raidstone.wgevents.events.RegionEnteredEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);

    Rabbit.getInstance();
    Rabbit.getInstance().registerExchange(new RegistrationExchange());
    Rabbit.getInstance().registerExchange(new MinecraftExchange());

    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();
    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));

    for (var regionId : regions.getRegions().keySet()) {
      regions.removeRegion(regionId);
    }

    Integer index = 0;
    for (int y = -16; y < 16; y++) {
      for (int x = -16; x < 16; x++) {
        var min = BlockVector3.at(x * 16, -64, y * 16);
        var max = BlockVector3.at(x * 16 + 15, 319, y * 16 + 15);
        var region = new ProtectedCuboidRegion(String.valueOf(index), min, max);
        region.setFlag(Flags.DENY_MESSAGE, "");
        regions.addRegion(region);

        index++;
      }
    }
  }

  @EventHandler
  public void onPlayerQuit(PlayerQuitEvent event) {
    Player player = event.getPlayer();
    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();
    stringMap.put("uuid", player.getUniqueId().toString());
    Rabbit.getInstance().publish("minecraft", "playerLeave", gson.toJson(stringMap));
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
  public void onRegionEntered(RegionEnteredEvent event) {
    Player player = Bukkit.getPlayer(event.getUUID());
    if (player == null) return;

    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();
    String regionName = event.getRegionName();

    stringMap.put("uuid", player.getUniqueId().toString());
    stringMap.put("region", regionName);

    Rabbit.getInstance().publish("minecraft", "regionEnter", gson.toJson(stringMap));

    player.sendMessage(regionName);
  }
}
