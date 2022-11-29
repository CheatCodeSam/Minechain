package minechain.apps.proxy;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.PlayerChatEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;
import minechain.libs.rabbit.Rabbit;
import org.slf4j.Logger;

@Plugin(
  id = "myfirstplugin",
  name = "My First Plugin",
  version = "0.1.0-SNAPSHOT",
  url = "https://example.org",
  description = "I did it!",
  authors = { "Me" }
)
public class App {

  private final ProxyServer server;
  private final Logger logger;

  @Inject
  public App(ProxyServer server, Logger logger) {
    this.server = server;
    this.logger = logger;
    Rabbit.getInstance().registerExchange(new ProxyExchange(this.server));
    this.logger.info("Hello there! I made my first plugin with Velocity.");
  }

  @Subscribe
  public void onPlayerChat(PlayerChatEvent p) {
    var serv = this.server.getServer("minechain");
    if (serv.isPresent()) {
      var regServ = serv.get();
      p.getPlayer().createConnectionRequest(regServ).connect();
    }
  }
}
