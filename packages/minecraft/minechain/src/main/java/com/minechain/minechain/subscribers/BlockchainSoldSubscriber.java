package com.minechain.minechain.subscribers;

import java.io.UnsupportedEncodingException;

import com.google.inject.Inject;
import com.minechain.minechain.services.PropertyService;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;

public class BlockchainSoldSubscriber implements ISubscriber {
    
    private PropertyService propertyService;

    @Inject
    public BlockchainSoldSubscriber(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
            byte[] body) {
        String message;
        try {
            message = new String(body, "UTF-8");
            this.handleData(message);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }


    private void handleData(String data) {
        try {
            System.out.println(data);
        } catch (Exception e) {
            // TODO: handle exception
        }
    }


}
