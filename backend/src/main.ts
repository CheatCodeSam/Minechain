import * as cookieParser from "cookie-parser"
import helmet from "helmet"

import { NestFactory } from "@nestjs/core"

import Moralis from "./Moralis.import"
import { AppModule } from "./app.module"

// Moralis.start({ moralisSecret: "" })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.use(helmet())
  app.setGlobalPrefix("api/v1")
  await app.listen(3001)
}
bootstrap()
