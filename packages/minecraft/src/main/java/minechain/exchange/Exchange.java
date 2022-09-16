package minechain.exchange;

import com.rabbitmq.client.DeliverCallback;
import com.rabbitmq.client.Delivery;
import java.lang.reflect.InvocationTargetException;
import minechain.Rabbit;

public abstract class Exchange {

  private String exchange;
  private String type;
  private boolean durable;

  protected Rabbit channel;

  public Exchange(String exchange, String type, boolean durable) {
    this.exchange = exchange;
    this.type = type;
    this.durable = durable;

    this.channel = Rabbit.getInstance();

    for (var m : this.getClass().getMethods()) {
      var routeMethod = m.getAnnotation(Route.class);
      var self = this;
      if (routeMethod != null) {
        DeliverCallback deliverCallback = new DeliverCallback() {
          public void handle(String s, Delivery delivery) {
            try {
              m.invoke(self, s, delivery);
            } catch (
              IllegalAccessException | IllegalArgumentException | InvocationTargetException e
            ) {
              e.printStackTrace();
            }
          }
        };
        this.channel.bindQueue(this.exchange, routeMethod.routingKey(), deliverCallback);
      }
    }
  }

  public String getExchange() {
    return exchange;
  }

  public String getType() {
    return type;
  }

  public boolean isDurable() {
    return durable;
  }
}
