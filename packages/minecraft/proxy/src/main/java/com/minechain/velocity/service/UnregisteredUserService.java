package com.minechain.velocity.service;

import java.util.HashMap;
import java.util.UUID;

import org.slf4j.Logger;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.velocity.App;
import com.minechain.velocity.instance.UnregisteredUser;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.ProxyServer;

@Singleton
public class UnregisteredUserService {

    private HashMap<UUID, UnregisteredUser> users;
    private Logger logger;
    private App app;
    private ProxyServer server;

    @Inject
    public UnregisteredUserService(Logger logger, App app, ProxyServer server) {
        this.users = new HashMap<UUID, UnregisteredUser>();
        this.app = app;
        this.server = server;
        this.logger = logger;
    }

    public boolean hasUser(Player player) {
        return this.users.containsKey(player.getUniqueId());
    }

    public void welcomeUser(Player player) {
        var user = this.users.get(player.getUniqueId());
        if (user != null)
            user.sendWelcomeMessage();
    }

    public void addUser(Player player, String token) {
        this.users.put(player.getUniqueId(), new UnregisteredUser(player, this.app, this.server, token));
    }

    public void removeUser(Player player) {
        var user = this.users.get(player.getUniqueId());
        if (user != null) {
            user.close();
            this.users.remove(player.getUniqueId());
        }
    }

}
