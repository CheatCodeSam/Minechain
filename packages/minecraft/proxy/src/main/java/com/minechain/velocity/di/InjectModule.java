package com.minechain.velocity.di;

import org.slf4j.Logger;

import com.google.inject.AbstractModule;
import com.minechain.velocity.App;
import com.minechain.velocity.service.ConfigService;
import com.velocitypowered.api.proxy.ProxyServer;

public class InjectModule extends AbstractModule {

    private ProxyServer server;
    private App app;
    private Logger logger;
    private ConfigService config;

    public InjectModule(App app, ProxyServer server, Logger logger, ConfigService configuration) {
        this.app = app;
        this.server = server;
        this.logger = logger;
        this.config = configuration;
    }

    @Override
    protected void configure() {
        this.bind(App.class).toInstance(app);
        this.bind(ProxyServer.class).toInstance(server);
        this.bind(Logger.class).toInstance(logger);
        this.bind(ConfigService.class).toInstance(config);
    }
}
