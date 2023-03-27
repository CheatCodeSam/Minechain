package com.minechain.velocity.service;

import com.moandjiezana.toml.Toml;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

// https://github.com/FeuSalamander/Vmessage/blob/main/src/main/resources/config.toml
public class ConfigService {
    private String RabbitMqIp;
    private String RabbitMqPort;
    private Toml config;
    private static File file;

    ConfigService(Toml config) {
        RabbitMqIp = config.getString("RabbitMQ.ip", "0.0.0.0");
        RabbitMqPort = config.getString("RabbitMQ.port", "5672");
        this.config = config;
    }

    public static ConfigService load(Path dataDirectory) {
        Path f = createConfig(dataDirectory);
        if (f != null) {
            file = f.toFile();
            Toml config = new Toml().read(file);
            return new ConfigService(config);
        }
        return null;
    }

    private static Path createConfig(Path dataDirectory){
        try {
            if (Files.notExists(dataDirectory)){
                Files.createDirectory(dataDirectory);
            }
            Path f = dataDirectory.resolve("config.toml");
            if (Files.notExists(f)){
                try (InputStream stream = ConfigService.class.getResourceAsStream("/config.toml")) {
                    Files.copy(Objects.requireNonNull(stream), f);
                }
            }
            return f;
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    void reload(){
        config = config.read(file);
        RabbitMqIp = config.getString("RabbitMQ.ip", "0.0.0.0");
        RabbitMqPort = config.getString("RabbitMQ.port", "5672");
    }

    public String getRabbitMqIp() {
        return RabbitMqIp;
    }

    public String getRabbitMqPort() {
        return RabbitMqPort;
    }

}
