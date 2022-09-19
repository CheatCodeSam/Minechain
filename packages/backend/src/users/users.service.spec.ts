import Moralis from "moralis"
import { Repository } from "typeorm"

import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule, TypeOrmModuleOptions, getRepositoryToken } from "@nestjs/typeorm"

import { Session } from "../auth/session.entity"
import { Token } from "../blockchain/token.entity"
import { TestService } from "../test/test.service"
import { User } from "./entities/user.entity"
import { UsersService } from "./users.service"

const publicAddress = "0x2061dd3a9f09186b5CD82436467dDB79dC737227"

Moralis.start({ apiKey: process.env.MORALIS_SECRET })

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
  let service: UsersService
  let testService: TestService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([User, Session])
      ],
      providers: [UsersService, TestService]
    }).compile()

    service = module.get<UsersService>(UsersService)
    testService = module.get<TestService>(TestService)
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterAll(() => {
    module.close()
  })

  beforeEach(async () => {
    await testService.cleanDatabase()
  })

  it("test", async () => {
    const user = await userRepo.save(userRepo.create({ publicAddress }))

    const images = await service.getNfts(user.publicAddress)

    console.log(images)
  })
})
