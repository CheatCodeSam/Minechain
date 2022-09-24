import { DataSource } from "typeorm"

import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AdminModule } from "./admin/admin.module"
import { AuthModule } from "./auth/auth.module"
import { Session } from "./auth/session.entity"
import { BlockchainModule } from "./blockchain/blockchain.module"
import { Token } from "./blockchain/token.entity"
import { MinecraftModule } from "./minecraft/minecraft.module"
import { User } from "./users/entities/user.entity"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "sqlite",
          database: "db",
          //   type: "postgres",
          //   host: process.env.PGHOST,
          //   port: 5432,
          //   username: process.env.PGUSER,
          //   password: process.env.PGPASSWORD,
          //   database: process.env.PGDATABASE,
          synchronize: true,
          entities: [User, Session, Token]
        }
      }
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    MinecraftModule,
    BlockchainModule
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  getDataSource() {
    return this.dataSource
  }
}
