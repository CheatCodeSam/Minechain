package minechain;

import com.google.gson.Gson;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.flags.StateFlag;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;
import java.util.LinkedHashMap;
import java.util.Map;
import minechain.exchange.BlockchainExchange;
import minechain.exchange.RegistrationExchange;
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

    Rabbit.getInstance();

    Rabbit.getInstance().registerExchange(new RegistrationExchange());
    Rabbit.getInstance().registerExchange(new BlockchainExchange());

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
        var max = BlockVector3.at(x * 16 + 16, 319, y * 16 + 16);
        var region = new ProtectedCuboidRegion(String.valueOf(index), min, max);
        region.setFlag(Flags.BUILD, StateFlag.State.DENY);
        region.setFlag(Flags.DENY_MESSAGE, "");
        regions.addRegion(region);

        index++;
      }
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
