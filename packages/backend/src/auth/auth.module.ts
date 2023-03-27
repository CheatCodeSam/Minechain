import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import expressSession from 'express-session';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import passport from 'passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSerializer } from './session/user-session.serializer';
import { Web3Strategy } from './strategy/web3.strategy';
import { Session } from './session/session.entity';
import { User } from '../user/user.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserSerializer, Web3Strategy],
  imports: [
    ConfigModule.forRoot({}),
    UserModule,
    TypeOrmModule.forFeature([User, Session]),
    PassportModule.register({
      session: true,
    }),
  ],
})
export class AuthModule implements NestModule {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Session) private sessionRepo: Repository<Session>
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
      .forRoutes('*');
  }
}
