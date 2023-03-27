package com.minechain.velocity.instance;

import java.util.concurrent.TimeUnit;

import com.minechain.velocity.App;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.scheduler.ScheduledTask;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.ClickEvent;
import net.kyori.adventure.text.format.TextColor;
import net.kyori.adventure.text.format.TextDecoration;

public class UnregisteredUser {

    private Player player;
    private ProxyServer server;
    private String token;

    private ScheduledTask warningTask;
    private ScheduledTask kickTask;

    public UnregisteredUser(Player player, App app, ProxyServer server, String token) {
        this.server = server;
        this.player = player;
        this.token = token;

        this.warningTask = this.server.getScheduler()
                .buildTask(app, () -> this.sendWarningMessage())
                .delay(3L, TimeUnit.MINUTES)
                .schedule();

        this.kickTask = this.server.getScheduler()
                .buildTask(app, () -> this.kickPlayer())
                .delay(6L, TimeUnit.MINUTES)
                .schedule();
    }

    public void sendWelcomeMessage() {
        player.sendMessage(Component
                .text("Hello " + player.getUsername() + ", Welcome to Minechain."));
        player.sendMessage(
                Component
                        .text("To link your Minecraft account to your wallet ")
                        .append(Component.text("click here!")
                                .clickEvent(ClickEvent.openUrl(
                                        "http://localhost:4200/register/"
                                                + token))
                                .color(TextColor.color(255, 0, 0))
                                .decorate(TextDecoration.UNDERLINED)));

    }

    public void close() {
        this.warningTask.cancel();
        this.kickTask.cancel();
    }

    private void sendWarningMessage() {
        player.sendMessage(
                Component
                        .text("Please link your Minecraft account to your wallet by ")
                        .append(Component.text("clicking here!")
                                .clickEvent(ClickEvent.openUrl(
                                        "http://localhost:4200/register/"
                                                + token))
                                .color(TextColor.color(255, 0, 0))
                                .decorate(TextDecoration.UNDERLINED)));
    }

    private void kickPlayer() {
        player.disconnect(Component.text("u sux"));
    }



}
