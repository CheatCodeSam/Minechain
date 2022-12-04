package minechain.apps.minechainmain.exchanges;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import java.io.UnsupportedEncodingException;
import minechain.apps.minechainmain.App;
import minechain.apps.minechainmain.dtos.McAllocation;
import minechain.apps.minechainmain.dtos.MinechainUser;
import minechain.apps.minechainmain.events.AllocateChunk;
import minechain.apps.minechainmain.events.AuthorizedJoin;
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
    var data = gson.fromJson(message, McAllocation.class);

    var user = data.user;
    var tokenId = data.token;

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

  @Route(routingKey = "authorizeJoin", queueName = "mcAuthorizeJoin")
  public void authorizeJoin(String consumerTag, Delivery delivery)
    throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    var mcUser = gson.fromJson(message, MinechainUser.class);

    Bukkit
      .getScheduler()
      .runTask(
        instance,
        new Runnable() {
          @Override
          public void run() {
            Bukkit.getPluginManager().callEvent(new AuthorizedJoin(mcUser));
          }
        }
      );
  }
}
