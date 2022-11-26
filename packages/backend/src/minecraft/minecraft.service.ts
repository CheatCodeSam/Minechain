import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { plainToClass } from "class-transformer"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"
import { Repository } from "typeorm"

import { ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { EventsGateway } from "./events.gateway"

@Injectable()
export class MinecraftService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private io: EventsGateway
  ) {}

  public async regionEnter(uuid: string, region: string) {
    const user = await this.userRepo.findOneBy({ mojangId: uuid })
    if (user) {
      user.lastKnownRegion = region
      this.userRepo.save(user)
      this.io.emit("regionEnter", user)
    }
  }

  public async playerLeave(uuid: string) {
    const user = await this.userRepo.findOneBy({ mojangId: uuid })
    if (user) this.io.emit("authorizedLeave", user)
  }
}
