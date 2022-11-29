package minechain.apps.proxy;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import com.velocitypowered.api.proxy.ProxyServer;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import minechain.libs.rabbit.Exchange;
import minechain.libs.rabbit.Route;

public class ProxyExchange extends Exchange {

  public ProxyExchange(ProxyServer server) {
    super("proxy", "direct", true);
  }

  @Route(routingKey = "transfer")
  public void registerToken(String consumerTag, Delivery delivery)
    throws UnsupportedEncodingException {
    var message = new String(delivery.getBody(), "UTF-8");
    var gson = new Gson();
    Map map = gson.fromJson(message, Map.class);
    System.out.println(map.get("uuid"));
  }
}
