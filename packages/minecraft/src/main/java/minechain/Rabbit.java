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
    this.channel.exchangeDeclare("registration", "fanout", true);
    String queueName = this.channel.queueDeclare().getQueue();
    this.channel.queueBind(queueName, EXCHANGE_NAME, "");

    DeliverCallback deliverCallback = (consumerTag, delivery) -> {
      String message = new String(delivery.getBody(), "UTF-8");
      System.out.println(" [x] Received '" + message + "'");
    };
    channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
  }

  public void publish(String msg) throws IOException {
    channel.basicPublish("registration", "", null, msg.getBytes());
  }
}
