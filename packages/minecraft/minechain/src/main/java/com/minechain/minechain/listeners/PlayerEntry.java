package com.minechain.minechain.listeners;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.minechain.minechain.messaging.RabbitMQ;
import com.minechain.minechain.services.MessageService;
import com.minechain.minechain.services.UserService;
import com.minechain.minechain.types.MojangIdDto;
import com.minechain.minechain.types.UserDto;
import com.rabbitmq.client.RpcClient;
import com.rabbitmq.client.RpcClientParams;


public class PlayerEntry implements Listener {

    private RpcClient authenticateRpc;
    private RabbitMQ mqqt;
    private JavaPlugin app;
    private UserService userService;
    private MessageService messageService;

    @Inject
    public PlayerEntry(RabbitMQ mqqt, JavaPlugin app, UserService userService, MessageService messageService) throws IOException
    {
        this.app = app;
        this.mqqt = mqqt;
        this.userService = userService;
        this.messageService = messageService;
        var newChannel = this.mqqt.createChannel();
        newChannel.exchangeDeclare("minecraft", "direct");

        this.authenticateRpc = new RpcClient(
            new RpcClientParams().channel(newChannel).exchange("minecraft")
                    .routingKey("authenticate"));
            
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event)
    {
        event.joinMessage(null);
        if(this.userService.hasUser(event.getPlayer()))
        {
            var user = this.userService.getUserInformation(event.getPlayer());
            this.messageService.welcomeBroadcast(user, event.getPlayer());
        }
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event)
    {
        this.userService.removeUser(event.getPlayer());
    }

    @EventHandler
    public void onAsyncPlayerPreLogin(AsyncPlayerPreLoginEvent  event) throws Exception {
        var rpc = this.authenticateRpc;
        var result = CompletableFuture.supplyAsync(() -> {
            try {
                return rpc.stringCall(new Gson().toJson(new MojangIdDto(event.getUniqueId())));
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        });
        var user = new Gson().fromJson(result.get(), UserDto.class);
        this.userService.addUser(user);
        app.getLogger().info(String.format("%s has joined under %s", user.getDisplayName(), event.getUniqueId().toString()));
        event.allow();
    }
    
}
 