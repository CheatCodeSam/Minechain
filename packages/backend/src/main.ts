import * as cookieParser from "cookie-parser"
import "dotenv/config"
import * as session from "express-session"
import helmet from "helmet"

import { NestFactory } from "@nestjs/core"

import Moralis from "./Moralis.import"
import { AppModule } from "./app.module"

Moralis.start({ moralisSecret: process.env.MORALIS_SECRET })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(cookieParser())
  app.use(helmet())
  app.setGlobalPrefix("api/v1")
  await app.listen(3001)
}
bootstrap()
