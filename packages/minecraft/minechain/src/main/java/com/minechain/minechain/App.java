package com.minechain.minechain;

import net.kyori.adventure.text.Component;


import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.Guice;
import com.minechain.minechain.di.InjectModule;
import com.minechain.minechain.messaging.RabbitMQ;

public class App extends JavaPlugin implements Listener {

    private RabbitMQ mqqt;

    @Override
    public void onEnable() {
        Bukkit.getPluginManager().registerEvents(this, this);
        var injector = Guice.createInjector(new InjectModule(this));
        injector.injectMembers(this);


        this.mqqt = injector.getInstance(RabbitMQ.class);
        try {
            this.mqqt.connect();
        } catch (Exception e) {
            this.getLogger().warning(e.getMessage());
        }
    }

    @Override
    public void onDisable() {
        this.mqqt.close();
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        event.getPlayer().sendMessage(Component.text("Hello, " + event.getPlayer().getName() + "!"));
    }

    @EventHandler
    public void onAsyncLogin(AsyncPlayerPreLoginEvent  event) throws InterruptedException {
        this.getLogger().info(event.getUniqueId().toString());
        event.allow();
    }

}