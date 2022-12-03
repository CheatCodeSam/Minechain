package minechain.apps.minechainmain;

import com.google.gson.Gson;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldedit.math.BlockVector3;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.domains.DefaultDomain;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.regions.ProtectedCuboidRegion;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import minechain.apps.minechainmain.dtos.MinechainUser;
import minechain.apps.minechainmain.events.AllocateChunk;
import minechain.apps.minechainmain.events.AuthorizedJoin;
import minechain.apps.minechainmain.exchanges.MinecraftExchange;
import minechain.libs.rabbit.Rabbit;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.TextComponent;
import net.raidstone.wgevents.events.RegionEnteredEvent;
import org.bukkit.Bukkit;
import org.bukkit.boss.BarColor;
import org.bukkit.boss.BarStyle;
import org.bukkit.boss.BossBar;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  HashMap<UUID, BossBar> map;
  private HashMap<String, MinechainUser> regionsOwned = new HashMap<>();

  public App() {
    this.map = new HashMap<>();
  }

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);

    Rabbit.getInstance().registerExchange(new MinecraftExchange(this));
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

  @Override
  public void onDisable() {
    Rabbit.getInstance().close();
  }

  @EventHandler
  public void onAuthorizedJoin(AuthorizedJoin event) {
    System.out.println(event.getUser());
    var playerId = event.getUser().mojangId;
    var player = getServer().getPlayer(playerId);
    var lastRegion = event.getUser().lastKnownRegion;
    var bossBar = Bukkit.createBossBar(lastRegion, BarColor.BLUE, BarStyle.SOLID);
    bossBar.addPlayer(player);
    this.map.put(playerId, bossBar);

    var welcomeMessage = new TextComponent(
      String.format("%s has joined as %s.", event.getUser().shortName, player.getName())
    );
    welcomeMessage.setColor(ChatColor.YELLOW);
    Bukkit.broadcast(welcomeMessage);
  }

  @EventHandler
  public void onPlayerQuit(PlayerQuitEvent event) {
    Player player = event.getPlayer();

    this.map.remove(player.getUniqueId());

    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();
    stringMap.put("uuid", player.getUniqueId().toString());
    Rabbit.getInstance().publish("minecraft", "playerLeave", gson.toJson(stringMap));
  }

  @EventHandler
  public void onRegionEntered(RegionEnteredEvent event) {
    Player player = Bukkit.getPlayer(event.getUUID());
    if (player == null) return;

    var owner = this.regionsOwned.get(event.getRegion().getId());

    String barValue = event.getRegionName();
    if (owner != null) barValue = barValue.concat(" - owned by ").concat(owner.shortName);

    var bossBar = this.map.get(player.getUniqueId());
    bossBar.setTitle(barValue);

    Gson gson = new Gson();
    Map<String, String> stringMap = new LinkedHashMap<>();
    String regionName = event.getRegionName();

    stringMap.put("uuid", player.getUniqueId().toString());
    stringMap.put("region", regionName);

    Rabbit.getInstance().publish("minecraft", "regionEnter", gson.toJson(stringMap));
  }

  @EventHandler
  public void onAllocateChunk(AllocateChunk event) {
    var player = new DefaultDomain();
    var UserId = event.getUser().mojangId;
    this.regionsOwned.put(event.getRegion().getId(), event.getUser());
    player.addPlayer(UserId);
    event.getRegion().setOwners(player);
  }
}
