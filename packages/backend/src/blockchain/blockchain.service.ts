import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { instanceToPlain } from "class-transformer"
import { Repository } from "typeorm"

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { UserDto } from "../users/dto/user.dto"
import { User } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"
import { Token } from "./token.entity"

@Injectable()
export class BlockchainService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    private readonly amqpConnection: AmqpConnection,
    private userService: UsersService
  ) {}
  async transfer(from: string, to: string, tokenId: string, data?) {
    to = to.toLowerCase()
    from = from.toLowerCase()
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    const tokenInt = parseInt(tokenId)

    let existingUser = await this.userService.findOne({ publicAddress: to })
    if (!existingUser) {
      const user = this.userRepo.create({ publicAddress: to })
      existingUser = await this.userRepo.save(user)
    }

    let token: Token
    if (from === zeroAddress) {
      const newToken = this.tokenRepo.create({ tokenId: tokenInt })
      newToken.user = existingUser
      token = await this.tokenRepo.save(newToken)
    } else {
      const transferToken = await this.tokenRepo.findOneBy({ tokenId: tokenInt })
      transferToken.user = existingUser
      token = await this.tokenRepo.save(transferToken)
    }

    const userSerialized = instanceToPlain(new UserDto(existingUser))
    const allocate = {
      user: userSerialized,
      token: tokenId
    }
    console.log(userSerialized)

    this.amqpConnection.publish("minecraft", "allocate", allocate)
    console.log(from, to, tokenId)
    return token
  }
}
