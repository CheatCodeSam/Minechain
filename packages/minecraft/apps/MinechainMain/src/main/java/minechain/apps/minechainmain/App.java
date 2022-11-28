package minechain.apps.minechainmain;

import org.bukkit.plugin.java.JavaPlugin;
import minechain.libs.rabbit.Rabbit;

public class App extends JavaPlugin {
    @Override
    public void onEnable() {
        var g = new Rabbit();
        g.helloWorld();
        getLogger().info("onEnable is called!");
    }

    @Override
    public void onDisable() {
        getLogger().info("onDisable is called!");
    }
}