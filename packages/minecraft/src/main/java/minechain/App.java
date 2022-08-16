package minechain;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);

    Bukkit.broadcastMessage("AWS Manager Pluggin Started!");
  }

  @EventHandler
  public void onPlayerJoin(PlayerJoinEvent playerJoinEvent) throws Exception {
    Bukkit.broadcastMessage(playerJoinEvent.getPlayer().getDisplayName() + " has joined!");
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    Connection connection = factory.newConnection();
    Channel channel = connection.createChannel();
    String message =
      "{".concat("\"pattern\": \"greeting \",")
        .concat("\"data\": \"")
        .concat(playerJoinEvent.getPlayer().getDisplayName())
        .concat("\"}");
    channel.queueDeclare("me", true, false, false, null);
    channel.basicPublish("", "me", null, message.getBytes());
  }
}
