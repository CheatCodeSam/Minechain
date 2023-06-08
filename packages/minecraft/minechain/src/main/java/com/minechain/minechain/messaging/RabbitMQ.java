package com.minechain.minechain.messaging;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.services.ConfigService;
import com.minechain.minechain.subscribers.ISubscriber;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

@Singleton
public class RabbitMQ {

    private Connection connection;
    private Channel channel;
    private ConfigService configuration;

    @Inject
    public RabbitMQ(ConfigService configuration) throws Exception {
        this.configuration = configuration;
    }

    public void connect() throws Exception {
        var factory = new ConnectionFactory();
        factory.setHost(configuration.getRabbitMqIp());
        factory.setPort(Integer.parseInt(configuration.getRabbitMqPort()));
        factory.setAutomaticRecoveryEnabled(true);
        factory.setNetworkRecoveryInterval(5000);
        factory.setTopologyRecoveryEnabled(true);


        this.connection = factory.newConnection();
        this.channel = this.connection.createChannel();
    }

    public Channel createChannel() throws IOException {
        return this.connection.createChannel();
    }

    public void addConsumer(ISubscriber subscriber, String exchange, String routingKey) {
        try {

            var channel = this.createChannel();

            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                        byte[] body) throws IOException {
                    subscriber.handleDelivery(consumerTag, envelope, properties, body);
                }
            };

            channel.exchangeDeclare(exchange, "direct");
            var queue = channel.queueDeclare("", false, false, true, null).getQueue();
            channel.queueBind(queue, exchange, routingKey);
            channel.basicConsume(queue, true, consumer);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void close() {
        try {
            this.channel.close();
            this.connection.close();
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

}
