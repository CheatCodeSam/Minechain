package minechain.exchange;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import com.sk89q.worldedit.bukkit.BukkitAdapter;
import com.sk89q.worldguard.WorldGuard;
import com.sk89q.worldguard.protection.flags.Flags;
import com.sk89q.worldguard.protection.flags.StateFlag;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import org.bukkit.Bukkit;

public class BlockchainExchange extends Exchange {

  public BlockchainExchange() {
    super("blockchain", "direct", true);
  }

  @Route(routingKey = "transfer")
  public void transfer(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    var message = new String(delivery.getBody(), "UTF-8");
    var gson = new Gson();
    Map<String, Object> map = gson.fromJson(message, Map.class);
    var value = Integer.parseInt(map.get("value").toString());
    var x = (value / 32) - 16;
    var y = (value % 32) - 16;

    var msg =
      "User: " +
      map.get("to").toString() +
      " now owns x: " +
      String.valueOf(x) +
      " y: " +
      String.valueOf(y);

    var container = WorldGuard.getInstance().getPlatform().getRegionContainer();
    var world = Bukkit.getServer().getWorld("world");
    var regions = container.get(BukkitAdapter.adapt(world));
    var RegionPurchased = regions.getRegion(String.valueOf(value));
    RegionPurchased.setFlag(Flags.BUILD, StateFlag.State.ALLOW);
    Bukkit.getLogger().info(String.valueOf(value));

    Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
  }
}