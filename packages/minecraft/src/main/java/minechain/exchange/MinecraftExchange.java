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
import minechain.App;
import minechain.events.AllocateChunk;
import org.bukkit.Bukkit;

public class MinecraftExchange extends Exchange {

  private App instance;

  public MinecraftExchange(App instance) {
    super("minecraft", "direct", true);
    this.instance = instance;
  }

  @Route(routingKey = "allocate")
  public void allocate(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    Map map = gson.fromJson(message, Map.class);
    var user = (Map) map.get("user");
    var tokenId = map.get("token").toString();

    Bukkit
      .getScheduler()
      .runTask(
        instance,
        new Runnable() {
          @Override
          public void run() {
            Bukkit.getPluginManager().callEvent(new AllocateChunk(user, tokenId));
          }
        }
      );
  }
}
