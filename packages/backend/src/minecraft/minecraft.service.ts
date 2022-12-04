import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { instanceToPlain, plainToClass } from "class-transformer"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"
import { Repository } from "typeorm"

import { ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { UserDto } from "../users/dto/user.dto"
import { User } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"
import { EventsGateway } from "./events.gateway"

@Injectable()
export class MinecraftService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private io: EventsGateway,
    private userService: UsersService
  ) {}

  public async regionEnter(uuid: string, region: string) {
    const user = await this.userService.findOne({ mojangId: uuid })
    if (user) {
      user.lastKnownRegion = region
      this.userRepo.save(user)
      const userSerialized = instanceToPlain(new UserDto(user))
      this.io.emit("regionEnter", userSerialized)
    }
  }

  public async playerLeave(uuid: string) {
    const user = await this.userService.findOne({ mojangId: uuid })
    if (user) {
      const userSerialized = instanceToPlain(new UserDto(user))
      this.io.emit("authorizedLeave", userSerialized)
    }
  }
}
