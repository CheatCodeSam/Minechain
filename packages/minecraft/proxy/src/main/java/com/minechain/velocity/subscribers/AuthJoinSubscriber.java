package com.minechain.velocity.subscribers;

import java.io.UnsupportedEncodingException;

import com.google.gson.Gson;
import com.minechain.velocity.types.RegisterUser;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Envelope;
import com.velocitypowered.api.proxy.ProxyServer;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.ClickEvent;
import net.kyori.adventure.text.format.TextColor;
import net.kyori.adventure.text.format.TextDecoration;

public class AuthJoinSubscriber implements ISubscriber {

    private ProxyServer server;

    public AuthJoinSubscriber(ProxyServer server) {
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
        var user = new Gson().fromJson(data, RegisterUser.class);
        var player = this.server.getPlayer(user.getUuid());

        player.ifPresent(p -> {
            p.sendMessage(Component.text("Hello " + p.getUsername() + ", Welcome to Minechain."));
            p.sendMessage(
                    Component
                            .text("To link your Minecraft account to your Wallet ")
                            .append(Component.text("click here!")
                                    .clickEvent(ClickEvent.openUrl("http://localhost:4200/register/" + user.getToken()))
                                    .color(TextColor.color(255, 0, 0))
                                    .decorate(TextDecoration.UNDERLINED)));
        });
    }

}
