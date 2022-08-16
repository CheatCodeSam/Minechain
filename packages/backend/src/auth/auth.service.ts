import { ethers } from "ethers"
import { generate as generateShortUuid } from "short-uuid"
import { Repository } from "typeorm"

import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { PublicAddressDto } from "./dto/publicAddress.dto"
import { VerificationDto } from "./dto/verification.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject("me2") private client: ClientProxy
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
    this.client.emit("greeting ", "Progressive Coder")
    if (publicAddress.toLowerCase() === decodedAddress.toLowerCase()) {
      user.isActive = true
      user.nonce = generateShortUuid()
      return this.userRepo.save(user)
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
