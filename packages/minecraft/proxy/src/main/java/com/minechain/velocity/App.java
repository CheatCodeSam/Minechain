package com.minechain.velocity;

import com.google.inject.Guice;
import com.google.inject.Inject;
import com.minechain.velocity.di.InjectModule;
import com.minechain.velocity.listeners.PlayerEntry;
import com.minechain.velocity.messaging.RabbitMQ;
import com.minechain.velocity.service.ConfigService;
import com.minechain.velocity.subscribers.AuthJoinSubscriber;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.event.proxy.ProxyShutdownEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;

import java.nio.file.Path;

import org.slf4j.Logger;

@Plugin(id = "minechain-velocity", name = "Minechain Velocity", version = "0.1.0-SNAPSHOT", url = "https://github.com/CheatCodeSam/Minechain", description = "I did it!", authors = {
        "Carson Weeks <mail@carsonweeks.com>" })
public class App {

    private ProxyServer server;
    private Logger logger;
    private Path dataDirectory;

    private RabbitMQ mqqt;

    @Inject
    public App(ProxyServer server, Logger logger, @DataDirectory Path dataDirectory) throws Exception {
        this.server = server;
        this.logger = logger;
        this.dataDirectory = dataDirectory;
        this.logger.info("Minechain Velocity Successfully Loaded");
    }

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) throws Exception {
        var configuration = ConfigService.load(dataDirectory);
        var injector = Guice.createInjector(new InjectModule(this, server, logger, configuration));
        injector.injectMembers(this);

        this.mqqt = injector.getInstance(RabbitMQ.class);
        this.mqqt.connect();
        this.mqqt.addConsumer(injector.getInstance(AuthJoinSubscriber.class), "account-link", "authorizeJoin");
        server.getEventManager().register(this, injector.getInstance(PlayerEntry.class));
    }

    @Subscribe
    public void onProxyShutdown(ProxyShutdownEvent event) {
        mqqt.close();
    }
}