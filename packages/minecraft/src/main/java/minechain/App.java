package minechain;

import com.destroystokyo.paper.event.player.PlayerJumpEvent;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  private Connection connection;
  private Channel channel;

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);
    try {
      startRabbitMQ();
    } catch (Exception e) {
      // TODO Auto-generated catch block
      Bukkit.getLogger().warning("error");
      e.printStackTrace();
    }

    Bukkit.broadcastMessage("AWS Manager Pluggin Started!");
  }

  private void startRabbitMQ() throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    this.connection = factory.newConnection();
    this.channel = connection.createChannel();
    this.channel.queueDeclare("me", true, false, false, null);
  }

  @EventHandler
  public void onPlayerJump(PlayerJumpEvent playerJumpEvent) throws Exception {
    Bukkit.getLogger().info("jump");

    String message =
      "{".concat("\"pattern\": \"greeting \",")
        .concat("\"data\": \"")
        .concat(playerJumpEvent.getPlayer().getDisplayName())
        .concat("\"}");
    channel.basicPublish("", "me", null, message.getBytes());
  }
}
