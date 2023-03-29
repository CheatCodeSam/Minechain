package com.minechain.minechain.listeners;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.function.Supplier;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.minechain.minechain.messaging.RabbitMQ;
import com.minechain.minechain.types.MojangId;
import com.minechain.minechain.types.User;
import com.rabbitmq.client.RpcClient;
import com.rabbitmq.client.RpcClientParams;


public class PlayerEntry implements Listener {

    private RpcClient authenticateRpc;
    private RabbitMQ mqqt;
    private JavaPlugin app;

    @Inject
    public PlayerEntry(RabbitMQ mqqt, JavaPlugin app) throws IOException
    {
        this.app = app;
        this.mqqt = mqqt;
        var newChannel = this.mqqt.createChannel();
        newChannel.exchangeDeclare("minecraft", "direct");

        this.authenticateRpc = new RpcClient(
            new RpcClientParams().channel(newChannel).exchange("minecraft")
                    .routingKey("authenticate"));
            
    }

    @EventHandler
    public void onAsyncPlayerPreLogin(AsyncPlayerPreLoginEvent  event) throws Exception {
        var rpc = this.authenticateRpc;
        var result = CompletableFuture.supplyAsync(new Supplier<String>() {
            @Override
            public String get() {
                String retVal = "";
                try {
                    retVal = rpc.stringCall(new Gson().toJson(new MojangId(event.getUniqueId())));
                } catch (Exception e) {
                    throw new IllegalStateException(e);
                }
                return retVal;
            }
        });
        var user = new Gson().fromJson(result.get(), User.class);
        app.getLogger().info(String.format("%s has joined under %s", user.getDisplayName(), event.getUniqueId().toString()));
        event.allow();
    }
    
}
 