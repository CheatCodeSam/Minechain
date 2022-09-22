import { IsUUID } from "class-validator"
import { ethers } from "ethers"
import { uuid } from "short-uuid"
import { Repository } from "typeorm"

import { ForbiddenException, NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from "@nestjs/typeorm"

import { Token } from "../blockchain/token.entity"
import { TestService } from "../test/test.service"
import { User } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"
import { Session } from "./session.entity"

import shortUUID = require("short-uuid")

export const createTestConfiguration = (): TypeOrmModuleOptions => ({
  type: "sqlite",
  database: ":memory:",
  entities: [User, Session, Token],
  dropSchema: true,
  synchronize: true,
  logging: false
})

describe("User Service", () => {
  let userRepo: Repository<User>
  let module: TestingModule
  let service: AuthService
  let testService: TestService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([User, Session])
      ],
      providers: [AuthService, TestService]
    }).compile()

    service = module.get<AuthService>(AuthService)
    testService = module.get<TestService>(TestService)
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterAll(() => {
    module.close()
  })

  beforeEach(async () => {
    await testService.cleanDatabase()
  })

  it("should create a new user", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress }))

    const foundUser = await userRepo.findOneBy({ publicAddress })

    expect(foundUser).toBeDefined()
    expect(foundUser.publicAddress).toEqual(publicAddress)
  })

  it("should verify user", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress }))
    const nonce = user.nonce

    const signedNonce = await wallet.signMessage(nonce)

    const verifiedUser = await service.verify({ publicAddress, signedNonce })

    expect(verifiedUser.isActive).toEqual(true)
  })

  it("throws an error is user signature is invalid", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    try {
      await service.verify({ publicAddress: publicAddress, signedNonce: "hjhjhh" })
    } catch (error) {
      expect(error).toEqual(new ForbiddenException("Signature is invalid."))
    }
  })

  it("throws and error if user public address does not exist", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress }))
    const nonce = user.nonce
    const signedNonce = await wallet.signMessage(nonce)
    try {
      await service.verify({ publicAddress: "dsfsfs", signedNonce: signedNonce })
    } catch (error) {
      expect(error).toEqual(new NotFoundException("User with public address does not exist."))
    }
  })

  it("throws an error if user has invalid public address", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress1 = wallet.address
    const user1 = await userRepo.save(userRepo.create({ publicAddress: publicAddress1 }))
    const nonce = user1.nonce

    const wallet2 = ethers.Wallet.createRandom()
    const publicAddress2 = wallet2.address
    const user2 = await userRepo.save(userRepo.create({ publicAddress: publicAddress2 }))

    const signedNonce = await wallet2.signMessage(nonce)
    try {
      await service.verify({ publicAddress: publicAddress1, signedNonce: signedNonce })
    } catch (error) {
      expect(error).toEqual(new ForbiddenException("Invalid public address."))
    }
  })

  it("should return user by Mojang ID", async () => {
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress, mojangId: "Hello World" }))
    expect(user.mojangId).toEqual("Hello World")
  })
})
