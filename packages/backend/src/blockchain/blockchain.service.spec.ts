import { ethers } from "ethers"
import { Repository } from "typeorm"

import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from "@nestjs/typeorm"

import { Session } from "../auth/session.entity"
import { Token } from "../blockchain/token.entity"
import { TestService } from "../test/test.service"
import { User } from "../users/entities/user.entity"
import { BlockchainService } from "./blockchain.service"

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
  let service: BlockchainService
  let testService: TestService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([User, Session, Token])
      ],
      providers: [BlockchainService, TestService]
    }).compile()

    service = module.get<BlockchainService>(BlockchainService)
    testService = module.get<TestService>(TestService)
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterAll(() => {
    module.close()
  })

  beforeEach(async () => {
    await testService.cleanDatabase()
  })

  it("saves token if from a zero address", async () => {
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const wallet = ethers.Wallet.createRandom()
    let publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress }))
    publicAddress = publicAddress.toLocaleLowerCase()
    const token = await service.transfer(zeroAddress, publicAddress, "2")
    expect(token.user.publicAddress).toEqual(publicAddress)
  })

  it("transfer a token from userA and userB", async () => {
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const wallet = ethers.Wallet.createRandom()
    let publicAddress = wallet.address
    const user = await userRepo.save(userRepo.create({ publicAddress }))
    publicAddress = publicAddress.toLowerCase()

    const wallet2 = ethers.Wallet.createRandom()
    let publicAddress2 = wallet2.address
    publicAddress2 = publicAddress2.toLowerCase()
    const toUser = await userRepo.save(userRepo.create({ publicAddress: publicAddress2 }))

    const token = await service.transfer(zeroAddress, publicAddress, "2")
    expect(token.user.publicAddress).toEqual(publicAddress)
    const transferToken = await service.transfer(publicAddress, publicAddress2, "2")
    transferToken.user = toUser
    expect(transferToken.user.publicAddress).toEqual(publicAddress2)
    console.log(toUser)
  })

  it("creates user from public address", async () => {
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    const wallet = ethers.Wallet.createRandom()
    const publicAddress = wallet.address
    await service.transfer(zeroAddress, publicAddress, "2")
    const foundUser = await userRepo.findOneBy({ publicAddress })
    expect(foundUser).toBeDefined()
  })
})
