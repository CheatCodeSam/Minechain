package com.minechain.minechain.listeners;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.minechain.minechain.messaging.RabbitMQ;
import com.minechain.minechain.types.MojangId;
import com.rabbitmq.client.RpcClient;
import com.rabbitmq.client.RpcClientParams;
import com.rabbitmq.client.ShutdownSignalException;


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
        System.out.println("hiiiiii");
        var rpc = this.authenticateRpc;
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    String g = rpc.stringCall(new Gson().toJson(new MojangId(event.getUniqueId())));
                    System.out.println(g);
                    event.allow();
                } catch (ShutdownSignalException | IOException | TimeoutException e) {
                    e.printStackTrace();
                }
            }
        }.runTaskAsynchronously(this.app);
        
        
    }
    
}
 