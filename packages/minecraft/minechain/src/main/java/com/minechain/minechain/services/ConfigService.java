package com.minechain.minechain.services;


import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;
import org.jetbrains.annotations.NotNull;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ConfigService {

    private @NotNull FileConfiguration config;

    @Inject
    public ConfigService(JavaPlugin app)
    {
        this.config = app.getConfig();
        app.saveDefaultConfig();
        app.getLogger().info(getRabbitMqIp());
        app.getLogger().info(getRabbitMqPort());

    }

    public String getRabbitMqIp() {
        return this.config.getString("rabbitmq.ip");
    }

    public String getRabbitMqPort() {
        return this.config.getString("rabbitmq.port");
    }
}
