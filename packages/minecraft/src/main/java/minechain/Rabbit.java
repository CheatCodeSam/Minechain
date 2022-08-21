package minechain;

import com.google.gson.Gson;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeoutException;
import net.md_5.bungee.api.ChatColor;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.TextComponent;
import org.bukkit.Bukkit;

public class Rabbit {

  private static Rabbit single_instance = null;

  private Connection connection;
  private Channel channel;
  private String EXCHANGE_NAME = "registration";

  private Rabbit() throws IOException, TimeoutException {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setAutomaticRecoveryEnabled(true);
    factory.setNetworkRecoveryInterval(5000);

    this.connection = factory.newConnection();
    this.channel = this.connection.createChannel();
    this.join();
  }

  public static Rabbit getInstance() throws IOException, TimeoutException {
    if (single_instance == null) single_instance = new Rabbit();

    return single_instance;
  }

  private void join() throws IOException {
    this.channel.exchangeDeclare("registration", "direct", true);
    String queueName = this.channel.queueDeclare().getQueue();
    String otherQueueName = this.channel.queueDeclare().getQueue();
    this.channel.queueBind(queueName, EXCHANGE_NAME, "registerToken");
    this.channel.queueBind(otherQueueName, EXCHANGE_NAME, "success");

    DeliverCallback deliverCallback = (consumerTag, delivery) -> {
      String message = new String(delivery.getBody(), "UTF-8");
      Gson gson = new Gson();
      Map map = gson.fromJson(message, Map.class);

      TextComponent msg = new TextComponent("Click here to register your account.");
      msg.setClickEvent(
        new ClickEvent(
          ClickEvent.Action.OPEN_URL,
          "http://localhost:4200/register/" + map.get("token")
        )
      );
      msg.setColor(ChatColor.RED);
      msg.setUnderlined(true);

      Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
    };
    channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});

    DeliverCallback otherDeliverCallback = (consumerTag, delivery) -> {
      String message = new String(delivery.getBody(), "UTF-8");
      Gson gson = new Gson();
      Map map = gson.fromJson(message, Map.class);
      String msg = "" + map.get("msg");
      Bukkit.getOnlinePlayers().forEach(p -> p.sendMessage(msg));
    };
    channel.basicConsume(otherQueueName, true, otherDeliverCallback, consumerTag -> {});
  }

  public void publish(String exchange, String routingKey, String json) throws IOException {
    channel.basicPublish(exchange, routingKey, null, json.getBytes());
  }
}
