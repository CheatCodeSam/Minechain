import { token } from "packages/abi-typings/src/lib/types/@openzeppelin/contracts"
import { Repository } from "typeorm"

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { Token } from "./token.entity"

@Injectable()
export class BlockchainService {
  //TODO
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>
  ) {}
  async transfer(from: string, to: string, tokenId: string, data) {
    to = to.toLowerCase()
    from = from.toLowerCase()
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    let existingUser = await this.userRepo.findOneBy({ publicAddress: to })
    if (existingUser === undefined) {
      const user = this.userRepo.create({ publicAddress: to })
      existingUser = await this.userRepo.save(user)
    }

    if (from === zeroAddress) {
      const tokenInt = parseInt(tokenId)
      const newToken = this.tokenRepo.create({ tokenId: tokenInt })
      newToken.user = existingUser
      const token = this.tokenRepo.save(newToken)
    } else console.log("Bought from another user")
    //if tranfer delete token from previous user
    //and udpdate to new user
    //make data base model for token in typeorm
    // set many to one relationship with user

    // this.transferTokensFromUser()

    // keep this
    console.log()
    const user = this.userRepo.findOneBy({ publicAddress: to })
    console.log(from, to, tokenId)
  }
}
