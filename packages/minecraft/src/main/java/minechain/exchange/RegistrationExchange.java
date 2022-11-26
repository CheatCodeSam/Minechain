package minechain.exchange;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.UUID;
import minechain.App;
import minechain.events.AuthJoin;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.TextComponent;
import org.bukkit.Bukkit;

public class RegistrationExchange extends Exchange {

  App instance;

  public RegistrationExchange(App instance) {
    super("registration", "direct", true);
    this.instance = instance;
  }

  @Route(routingKey = "registerToken")
  public void registerToken(String consumerTag, Delivery delivery)
    throws UnsupportedEncodingException {
    var message = new String(delivery.getBody(), "UTF-8");
    var gson = new Gson();
    Map map = gson.fromJson(message, Map.class);

    var msg = new TextComponent("Click here to register your account.");

    msg.setClickEvent(
      new ClickEvent(
        ClickEvent.Action.OPEN_URL,
        "http://localhost:4200/register/" + map.get("registerToken")
      )
    );
    msg.setColor(ChatColor.RED);
    msg.setUnderlined(true);

    var player = Bukkit.getServer().getPlayer(UUID.fromString(map.get("uuid").toString()));
    System.out.println(player.displayName().toString());
    if (player != null) player.sendMessage(msg);
  }

  @Route(routingKey = "authorizeJoin")
  public void success(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    Map<String, Object> map = gson.fromJson(message, Map.class);
    String msg = map.get("publicAddress").toString();

    var player = Bukkit.getPlayer(UUID.fromString(map.get("mojangId").toString()));

    Bukkit
      .getScheduler()
      .runTask(
        instance,
        new Runnable() {
          @Override
          public void run() {
            Bukkit.getPluginManager().callEvent(new AuthJoin(player, map));
          }
        }
      );

    Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
  }
}
