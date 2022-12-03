package minechain.libs.rabbit;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import java.io.IOException;

public class ConsumeFactory {

  private String queue;
  private String exchangeName;
  private String routingKey;
  private DeliverCallback deliverCallback;
  private Channel channel;

  ConsumeFactory(Channel channel) {
    this.channel = channel;
  }

  public ConsumeFactory Queue(String queue) {
    if (!queue.isEmpty()) {
      try {
        this.channel.queueDeclare(queue, true, false, false, null);
      } catch (IOException e) {
        e.printStackTrace();
      }
      this.queue = queue;
    }
    return this;
  }

  public ConsumeFactory ExchangeName(String exchangeName) {
    this.exchangeName = exchangeName;
    return this;
  }

  public ConsumeFactory RoutingKey(String routingKey) {
    this.routingKey = routingKey;
    return this;
  }

  public ConsumeFactory DeliverCallback(DeliverCallback deliverCallback) {
    this.deliverCallback = deliverCallback;
    return this;
  }

  public void create() throws IOException {
    if (this.queue == null) this.queue = this.channel.queueDeclare().getQueue();
    this.channel.queueBind(this.queue, this.exchangeName, this.routingKey);
    this.channel.basicConsume(this.queue, true, this.deliverCallback, consumerTag -> {});
  }
}
