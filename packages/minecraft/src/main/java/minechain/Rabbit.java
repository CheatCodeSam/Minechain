package minechain;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import java.io.IOException;
import java.util.concurrent.TimeoutException;
import org.bukkit.Bukkit;

public class Rabbit {

  private static Rabbit single_instance = null;

  private Connection connection;
  private Channel channel;
  private String queueName = "me";

  private Rabbit() throws IOException, TimeoutException {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setAutomaticRecoveryEnabled(true);
    factory.setNetworkRecoveryInterval(5000);

    this.connection = factory.newConnection();
    this.channel = this.connection.createChannel();
    this.join(this.queueName);
  }

  public static Rabbit getInstance() throws IOException, TimeoutException {
    if (single_instance == null) single_instance = new Rabbit();

    return single_instance;
  }

  private void join(String queueName) throws IOException {
    this.channel.queueDeclare(queueName, true, false, false, null);

    DeliverCallback deliverCallback = (consumerTag, delivery) -> {
      String message = new String(delivery.getBody(), "UTF-8");
      Bukkit.getLogger().info(message);
    };
    channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
  }
}
