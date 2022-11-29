package minechain.apps.minechainmain;

import minechain.libs.rabbit.Rabbit;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin {

  @Override
  public void onEnable() {
    getLogger().info("onEnable is called!");
  }

  @Override
  public void onDisable() {
    getLogger().info("onDisable is called!");
  }
}
