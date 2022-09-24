import { AdminModule } from "@adminjs/nestjs"
import * as AdminJSTypeorm from "@adminjs/typeorm"
import AdminJS from "adminjs"
import { DataSource } from "typeorm"

import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuthModule } from "./auth/auth.module"
import { Session } from "./auth/session.entity"
import { BlockchainModule } from "./blockchain/blockchain.module"
import { Token } from "./blockchain/token.entity"
import { MinecraftModule } from "./minecraft/minecraft.module"
import { User } from "./users/entities/user.entity"
import { UsersModule } from "./users/users.module"

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password"
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database
})

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
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: "/admin",
          resources: [
            {
              resource: User,
              options: {
                properties: {
                  publicAddress: {
                    isTitle: true
                  }
                }
              }
            },

            Session,
            Token
          ]
        },
        auth: {
          authenticate,
          cookieName: "adminjs",
          cookiePassword: "secret"
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: "secret"
        }
      })
    }),
    AuthModule,
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
