package minechain.apps.proxy;

import com.google.gson.Gson;
import com.rabbitmq.client.Delivery;
import com.velocitypowered.api.proxy.ProxyServer;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.UUID;
import minechain.libs.rabbit.Exchange;
import minechain.libs.rabbit.Route;

public class RegistrationExchange extends Exchange {

  private ProxyServer server;

  public RegistrationExchange(ProxyServer server) {
    super("registration", "direct", true);
    this.server = server;
  }

  @Route(routingKey = "authorizeJoin", queueName = "proxyAuthJoin")
  public void success(String consumerTag, Delivery delivery) throws UnsupportedEncodingException {
    String message = new String(delivery.getBody(), "UTF-8");
    Gson gson = new Gson();
    Map<String, Object> map = gson.fromJson(message, Map.class);

    var playerUUID = map.get("mojangId").toString();

    var serv = this.server.getServer("minechain");
    var player = this.server.getPlayer(UUID.fromString(playerUUID));
    if (serv.isPresent() && player.isPresent()) {
      var mcServ = serv.get();
      var p = player.get();
      p.createConnectionRequest(mcServ).connect();
    }
  }
}
