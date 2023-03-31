package com.minechain.minechain.services;

import java.util.HashMap;
import java.util.UUID;

import org.bukkit.entity.Player;

import com.google.inject.Singleton;
import com.minechain.minechain.types.UserDto;

@Singleton
public class UserService {

    private HashMap<UUID, UserDto> users;

    public UserService() {
        this.users = new HashMap<UUID, UserDto>();
    }

    public void addUser(UserDto user) {
        this.users.put(user.getMojangId(), user);
    }

    public void removeUser(Player player) {
        if (this.hasUser(player)) {
            this.users.remove(player.getUniqueId());
        }
    }

    public boolean hasUser(Player player) {
        return this.users.containsKey(player.getUniqueId());
    }

    public UserDto getUserInformation(Player Player) {
        if (this.hasUser(Player))
            return this.users.get(Player.getUniqueId());
        return null;
    }

}
