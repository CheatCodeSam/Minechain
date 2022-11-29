package minechain.apps.proxy;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import com.velocitypowered.api.proxy.ProxyServer;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.UUID;
import minechain.libs.rabbit.Exchange;
import minechain.libs.rabbit.Route;

public class ProxyExchange extends Exchange {

  private ProxyServer server;

  public ProxyExchange(ProxyServer server) {
    super("proxy", "direct", true);
    this.server = server;
  }

  @Route(routingKey = "transfer")
  public void registerToken(String consumerTag, Delivery delivery)
    throws UnsupportedEncodingException {
    var message = new String(delivery.getBody(), "UTF-8");
    var gson = new Gson();
    Map map = gson.fromJson(message, Map.class);
    var uuid = UUID.fromString(map.get("uuid").toString());
    var player = this.server.getPlayer(uuid);
    var mc = this.server.getServer("minechain");
    if (mc.isPresent() && player.isPresent()) {
      var p = player.get();
      var serv = mc.get();
      p.createConnectionRequest(serv).connect();
    }
  }
}
