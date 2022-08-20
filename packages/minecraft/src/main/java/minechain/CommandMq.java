package minechain;

import java.io.IOException;
import java.util.concurrent.TimeoutException;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

public class CommandMq implements CommandExecutor {

  @Override
  public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
    String msg = String.join(" ", args);
    // try {
    //   Rabbit.getInstance().publish(msg);
    // } catch (IOException e) {
    //   // TODO Auto-generated catch block
    //   e.printStackTrace();
    // } catch (TimeoutException e) {
    //   // TODO Auto-generated catch block
    //   e.printStackTrace();
    // }
    return false;
  }
}
