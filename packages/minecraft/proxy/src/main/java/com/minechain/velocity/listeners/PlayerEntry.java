package com.minechain.velocity.listeners;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import com.rabbitmq.client.RpcClient;
import com.rabbitmq.client.RpcClientParams;
import com.rabbitmq.client.ShutdownSignalException;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.minechain.velocity.messaging.RabbitMQ;
import com.minechain.velocity.service.UnregisteredUserService;
import com.minechain.velocity.types.MojangId;
import com.minechain.velocity.types.RegisterUser;
import com.velocitypowered.api.event.Continuation;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.connection.DisconnectEvent;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
import com.velocitypowered.api.event.player.ServerPostConnectEvent;
import com.velocitypowered.api.proxy.ProxyServer;

public class PlayerEntry {

    private RpcClient accountLinkService;
    private RpcClient generateTokenService;
    private ProxyServer server;
    private RabbitMQ mqqt;
    private UnregisteredUserService unregisteredUserService;

    @Inject
    public PlayerEntry(RabbitMQ mqqt, ProxyServer server, UnregisteredUserService unregisteredUserService)
            throws IOException {
        this.mqqt = mqqt;
        this.server = server;
        this.unregisteredUserService = unregisteredUserService;

        var newChannel = this.mqqt.createChannel();
        newChannel.exchangeDeclare("account-link", "direct");

        this.generateTokenService = new RpcClient(
                new RpcClientParams().channel(newChannel).exchange("account-link")
                        .routingKey("generateRegistrationToken"));
        this.accountLinkService = new RpcClient(
                new RpcClientParams().channel(this.mqqt.createChannel()).exchange("account-link")
                        .routingKey("isLinked"));
    }

    @Subscribe
    public void onPlayerJoin(PlayerChooseInitialServerEvent event, Continuation continuation)
            throws IOException, ShutdownSignalException, TimeoutException {

        var player = event.getPlayer();
        var isAccountLinked = this.accountLinkService
                .stringCall(new Gson().toJson(new MojangId(player.getUniqueId()))) == "true";

        if (!isAccountLinked) {
            var rawJson = this.generateTokenService
                    .stringCall(new Gson().toJson(new MojangId(player.getUniqueId())));
            var registrationInformation = new Gson().fromJson(rawJson, RegisterUser.class);
            this.unregisteredUserService.addUser(player, registrationInformation.getToken());
            if (this.server.getServer("lobby").isPresent())
                event.setInitialServer(this.server.getServer("lobby").get());
        } else {
            if (this.server.getServer("minechain").isPresent())
                event.setInitialServer(this.server.getServer("minechain").get());
        }

        continuation.resume();
    }

    @Subscribe
    public void onPlayerPostConnect(ServerPostConnectEvent event, Continuation continuation)
            throws ShutdownSignalException, IOException, TimeoutException {
        var player = event.getPlayer();
        if (player.getCurrentServer().isPresent())
            if (this.unregisteredUserService.hasUser(player))
                this.unregisteredUserService.welcomeUser(player);
        continuation.resume();
    }

    @Subscribe
    public void onPlayerDisconnect(DisconnectEvent event) {
        this.unregisteredUserService.removeUser(event.getPlayer());
    }

}
