package minechain.exchange;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.TextComponent;
import org.bukkit.Bukkit;

public class RegistrationExchange extends Exchange {

  public RegistrationExchange() {
    super("registration", "direct", true);
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
        "http://localhost:4200/register/" + map.get("token")
      )
    );
    msg.setColor(ChatColor.RED);
    msg.setUnderlined(true);

    Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
  }

  @Route(routingKey = "success")
  public void success(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    Map<String, Object> map = gson.fromJson(message, Map.class);
    String msg = map.get("msg").toString();
    Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
  }
}
