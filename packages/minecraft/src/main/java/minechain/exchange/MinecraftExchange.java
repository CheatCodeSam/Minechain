package minechain.exchange;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.domains.DefaultDomain;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.flags.StateFlag;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.UUID;
import org.bukkit.Bukkit;

public class MinecraftExchange extends Exchange {

  public MinecraftExchange() {
    super("minecraft", "direct", true);
  }

  @Route(routingKey = "allocate")
  public void allocate(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    Map map = gson.fromJson(message, Map.class);
    Bukkit.getLogger().info(map.toString());
    var mojangId = map.get("mojangId").toString();
    var tokenId = map.get("token").toString();

    var value = Integer.parseInt(tokenId);
    var x = (value / 32) - 16;
    var y = (value % 32) - 16;

    var msg =
      "User: " + mojangId + " now owns x: " + String.valueOf(x) + " y: " + String.valueOf(y);

    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();
    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));
    var RegionPurchased = regions.getRegion(String.valueOf(value));
    // RegionPurchased.setFlag(Flags.BUILD, StateFlag.State.ALLOW);

    var player = new DefaultDomain();
    var UserId = UUID.fromString(mojangId);
    player.addPlayer(UserId);
    RegionPurchased.setOwners(player);

    Bukkit.getLogger().info(String.valueOf(value));
  }
}
