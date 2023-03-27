package com.minechain.velocity.subscribers;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;

public interface ISubscriber {
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body);
}
