package com.minechain.minechain;

import org.bukkit.Bukkit;
import org.bukkit.event.Listener;

import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.Guice;
import com.minechain.minechain.di.InjectModule;
import com.minechain.minechain.listeners.PlayerEntry;
import com.minechain.minechain.messaging.RabbitMQ;
import com.minechain.minechain.subscribers.BlockchainSoldSubscriber;

public class App extends JavaPlugin implements Listener {

    private RabbitMQ mqqt;

    @Override
    public void onEnable() {
        var injector = Guice.createInjector(new InjectModule(this));
        injector.injectMembers(this);


        this.mqqt = injector.getInstance(RabbitMQ.class);
        try {
            this.mqqt.connect();
            this.mqqt.startRPCServer();
        } catch (Exception e) {
            this.getLogger().warning(e.getMessage());
        }

        this.mqqt.addConsumer(injector.getInstance(BlockchainSoldSubscriber.class), "blockchain", "sold");
        Bukkit.getPluginManager().registerEvents(injector.getInstance(PlayerEntry.class), this);
    }

    @Override
    public void onDisable() {
        this.mqqt.close();
    }
}