package minechain.channels;

import minechain.Rabbit;

public class Exchange {

  private String exchange;
  private String type;
  private boolean durable;

  protected Rabbit channel;

  public Exchange(String exchange, String type, boolean durable) {
    this.exchange = exchange;
    this.type = type;
    this.durable = durable;

    this.channel = Rabbit.getInstance();
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
