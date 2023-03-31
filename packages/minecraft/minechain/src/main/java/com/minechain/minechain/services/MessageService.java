package com.minechain.minechain.services;

import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.minechain.minechain.types.UserDto;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextColor;

@Singleton
public class MessageService {

    private JavaPlugin app;

    @Inject
    public MessageService(JavaPlugin app) {
        this.app = app;
    }

    public void welcomeBroadcast(UserDto user, Player player) {
        app.getServer().broadcast(Component.text(user.getDisplayName() + " has joined as " + player.getName())
                .color(TextColor.color(255, 255, 0)));
    }

}
