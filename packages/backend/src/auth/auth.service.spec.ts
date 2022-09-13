import { ethers } from "ethers"
import { DataSource, EntitySchema, Repository } from "typeorm"

import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"
import { Session } from "./session.entity"

type Entity = string | EntitySchema<any>

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

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([User, Session])
      ],
      providers: [AuthService]
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterAll(() => {
    module.close()
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
