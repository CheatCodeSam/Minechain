package minechain.apps.registration;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import java.io.UnsupportedEncodingException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import minechain.libs.rabbit.Exchange;
import minechain.libs.rabbit.Rabbit;
import minechain.libs.rabbit.Route;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.TextComponent;
import org.bukkit.Bukkit;

public class RegistrationExchange extends Exchange {

  private App instance;

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
}
