package com.minechain.minechain.di;

import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.AbstractModule;


public class InjectModule extends AbstractModule {

    private JavaPlugin app;

    public InjectModule(JavaPlugin app) {
        this.app = app;
    }

    @Override
    protected void configure() {
        this.bind(JavaPlugin.class).toInstance(this.app);
    }
}
