package com.minechain.minechain.subscribers;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.minechain.minechain.services.PropertyService;
import com.minechain.minechain.types.SoldDto;
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
            var gson = new Gson();
            var sold = gson.fromJson(data, SoldDto.class);

            this.propertyService.setPropertyOwner(sold.getTokenId(), sold.getProperty().getOwner().getMojangId());

        } catch (Exception e) {
            // TODO: handle exception
        }
    }

}
