package minechain.libs.rabbit;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import java.io.IOException;
import java.util.Vector;
import java.util.concurrent.TimeoutException;

public class Rabbit {

  private static Rabbit single_instance = null;

  private Connection connection;
  private Channel channel;
  private Vector<Exchange> exchanges;

  private Rabbit() throws IOException, TimeoutException {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setAutomaticRecoveryEnabled(true);
    factory.setNetworkRecoveryInterval(5000);
    factory.setTopologyRecoveryEnabled(true);

    this.exchanges = new Vector<Exchange>();
    this.connection = factory.newConnection();
    this.channel = this.connection.createChannel();
  }

  public static Rabbit getInstance() {
    if (single_instance == null) try {
      single_instance = new Rabbit();
    } catch (IOException | TimeoutException e) {
      e.printStackTrace();
    }

    return single_instance;
  }

  public void close() {
    try {
      this.connection.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void registerExchange(Exchange exchange) {
    this.exchanges.add(exchange);
    try {
      this.channel.exchangeDeclare(
          exchange.getExchange(),
          exchange.getType(),
          exchange.isDurable()
        );
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void publish(String exchange, String routingKey, String json) {
    try {
      channel.basicPublish(exchange, routingKey, null, json.getBytes());
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public ConsumeFactory bindQueue() {
    return new ConsumeFactory(this.channel);
  }
}
