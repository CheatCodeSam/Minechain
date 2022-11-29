package minechain.apps.minechainmain.exchanges;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import minechain.apps.minechainmain.App;
import minechain.apps.minechainmain.events.AllocateChunk;
import minechain.libs.rabbit.Exchange;
import minechain.libs.rabbit.Route;
import org.bukkit.Bukkit;

public class MinecraftExchange extends Exchange {

  private App instance;

  public MinecraftExchange(App instance) {
    super("minecraft", "direct", true);
    this.instance = instance;
  }

  @Route(routingKey = "allocate", queueName = "mcAllocate")
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
