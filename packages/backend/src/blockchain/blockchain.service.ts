import { Repository } from "typeorm"

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { Token } from "./token.entity"

@Injectable()
export class BlockchainService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>
  ) {}
  async transfer(from: string, to: string, tokenId: string, data) {
    to = to.toLowerCase()
    from = from.toLowerCase()
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    const tokenInt = parseInt(tokenId)

    let existingUser = await this.userRepo.findOneBy({ publicAddress: to })
    if (!existingUser) {
      const user = this.userRepo.create({ publicAddress: to })
      existingUser = await this.userRepo.save(user)
    }

    if (from === zeroAddress) {
      const newToken = this.tokenRepo.create({ tokenId: tokenInt })
      newToken.user = existingUser
      this.tokenRepo.save(newToken)
    } else {
      const transferToken = await this.tokenRepo.findOneBy({ tokenId: tokenInt })
      transferToken.user = existingUser
      this.tokenRepo.save(transferToken)
    }
    console.log(from, to, tokenId)
  }
}
