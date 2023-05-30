import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import expressSession from 'express-session'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import passport from 'passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserSerializer } from './session/user-session.serializer'
import { Web3Strategy } from './strategy/web3.strategy'
import { Session } from './session/session.entity'
import { User } from '../user/user.entity'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TypeormStore } from 'connect-typeorm'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserSerializer, Web3Strategy],
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: '60s',
          },
        }
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({}),
    UserModule,
    TypeOrmModule.forFeature([User, Session]),
    PassportModule.register({
      session: false,
    }),
  ],
})
export class AuthModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        expressSession({
          secret: this.configService.get('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
          store: new TypeormStore().connect(this.sessionRepo),
        }),
        passport.session()
      )
      .forRoutes('*')
  }
}
