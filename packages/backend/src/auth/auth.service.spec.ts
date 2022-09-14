import { ethers } from "ethers"
import { DataSource, EntitySchema, Repository } from "typeorm"
import { Connection } from "typeorm"

import { Inject, Injectable } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from "@nestjs/typeorm"

import { TestService } from "../test/test.service"
import { User } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"
import { Session } from "./session.entity"

export const createTestConfiguration = (): TypeOrmModuleOptions => ({
  type: "sqlite",
  database: ":memory:",
  entities: [User, Session],
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
})
