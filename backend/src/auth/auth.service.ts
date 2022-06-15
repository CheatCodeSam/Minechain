import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ethers } from "ethers"
import { generate as generateShortUuid } from "short-uuid"
import { User } from "../users/entities/user.entity"
import { Repository } from "typeorm"
import { PublicAddressDto } from "./dto/publicAddress.dto"
import { VerificationDto } from "./dto/verification.dto"

import { TokensService } from "./tokens.service"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private tokensService: TokensService
  ) {}

  async signIn({ publicAddress }: PublicAddressDto) {
    const existingUser = await this.userRepo.findOneBy({ publicAddress })
    if (existingUser) {
      return existingUser.nonce
    } else {
      const user = this.userRepo.create({ publicAddress })
      const savedUser = await this.userRepo.save(user)
      return savedUser.nonce
    }
  }

  async verify({ publicAddress, signedNonce }: VerificationDto) {
    if (!this.isValidSignature(signedNonce)) throw new ForbiddenException("Signature is invalid.")
    const user = await this.userRepo.findOneBy({ publicAddress })
    if (!user) throw new NotFoundException("User with public address does not exist.")

    const decodedAddress = ethers.utils.verifyMessage(user.nonce, signedNonce)

    if (publicAddress.toLowerCase() === decodedAddress.toLocaleLowerCase()) {
      user.isActive = true
      user.nonce = generateShortUuid()
      await this.userRepo.save(user)
      return this.tokensService.issueTokens(user)
    } else {
      throw new ForbiddenException("Invalid public address.")
    }
  }

  private isValidSignature(signature: string): boolean {
    // Hack solution
    try {
      ethers.utils.splitSignature(signature)
    } catch (error) {
      return false
    }
    return true
  }
}
