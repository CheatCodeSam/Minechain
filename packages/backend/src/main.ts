import { Minechain, abi } from "@./abi-typings"
import { TypeormStore } from "connect-typeorm"
import "dotenv/config"
import * as ethers from "ethers"
import * as session from "express-session"
import helmet from "helmet"
import Moralis from "moralis"
import * as passport from "passport"

import { NestFactory } from "@nestjs/core"

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

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const webSocketProvider = new ethers.providers.WebSocketProvider("ws://localhost:8545")
  const contract = new ethers.Contract(contractAddress, abi, webSocketProvider) as Minechain

  const filter = contract.filters.Transfer(null, null, null)
  contract.queryFilter(filter)
  contract.on(filter, (from, to, value, event) => {
    console.log({
      from: from,
      to: to,
      value: value.toString(),
      data: event
    })
  })

  await app.startAllMicroservices()
  await app.listen(3001)
}
bootstrap()
