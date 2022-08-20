import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"

import { Injectable } from "@nestjs/common"

@Injectable()
export class RegistrationService {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  @RabbitSubscribe({
    exchange: "registration",
    routingKey: "playerJoin",
    queue: "",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async pubSubHandler(msg: { uuid: string; displayName: string }) {
    const registrationToken = await this.createJwt(msg.uuid, msg.displayName)
    this.amqpConnection.publish("registration", "registerToken", { token: registrationToken })
    console.log(`Received message: ${JSON.stringify(msg)}`)
  }

  public async createJwt(mojangId: string, displayName: string): Promise<string> {
    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    const jwt = await new jose.SignJWT({ mojangId, displayName })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("minechain:backend")
      .setAudience("minechain:minecraft")
      .setExpirationTime("15m")
      .sign(privatekey)
    return jwt
  }
}
