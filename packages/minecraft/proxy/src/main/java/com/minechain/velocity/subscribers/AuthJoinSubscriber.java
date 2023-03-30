package com.minechain.velocity.subscribers;

import java.io.UnsupportedEncodingException;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.velocity.service.UnregisteredUserService;
import com.minechain.velocity.types.MojangId;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;
import com.velocitypowered.api.proxy.ProxyServer;

@Singleton
public class AuthJoinSubscriber implements ISubscriber {

    private UnregisteredUserService unregisteredUserService;
    private ProxyServer server;

    @Inject
    public AuthJoinSubscriber(ProxyServer server, UnregisteredUserService unregisteredUserService) {
        this.unregisteredUserService = unregisteredUserService;
        this.server = server;
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
            var userUuid = new Gson().fromJson(data, MojangId.class);
            var player = this.server.getPlayer(userUuid.getUuid());
            if (player.isPresent()) {
                this.unregisteredUserService.removeUser(player.get());
                if (this.server.getServer("minechain").isPresent())
                    player.get().createConnectionRequest(this.server.getServer("minechain").get()).connect();
            }
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

}
