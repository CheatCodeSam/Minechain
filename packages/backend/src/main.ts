import { TypeormStore } from "connect-typeorm"
import "dotenv/config"
import * as session from "express-session"
import helmet from "helmet"
import Moralis from "moralis"
import * as passport from "passport"

import { NestFactory } from "@nestjs/core"
import { RmqOptions, Transport } from "@nestjs/microservices"

import { AppModule } from "./app.module"
import { Session } from "./auth/session.entity"

Moralis.start({ apiKey: process.env.MORALIS_SECRET })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const sessionRepository = app.get(AppModule).getDataSource().getRepository(Session)
  app.use(
    session({
      name: "NESTJS_SESSION_ID",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepository)
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(helmet())
  app.setGlobalPrefix("api/v1")

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://guest:guest@localhost`],
      queue: "me",
      queueOptions: {
        durable: true
      }
    }
  })

  await app.startAllMicroservices()
  await app.listen(3001)
}
bootstrap()
