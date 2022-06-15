import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"

import { ConfigModule, ConfigService } from "@nestjs/config"
import { User } from "./users/entities/user.entity"
import { RefreshToken } from "./auth/entities/refreshtoken.entity"

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
          type: "postgres",
          host: process.env.PGHOST,
          port: 5432,
          username: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
          synchronize: true,
          entities: [User, RefreshToken]
        }
      }
    }),
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
