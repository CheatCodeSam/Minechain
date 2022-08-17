package minechain;

import java.io.IOException;
import java.util.concurrent.TimeoutException;
import org.bukkit.Bukkit;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

public class App extends JavaPlugin implements Listener {

  @Override
  public void onEnable() {
    Bukkit.getPluginManager().registerEvents(this, this);
    this.getCommand("mq").setExecutor(new CommandMq());

    try {
      Rabbit.getInstance();
    } catch (IOException | TimeoutException e) {
      e.printStackTrace();
    }
  }
}
