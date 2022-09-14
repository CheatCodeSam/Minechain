import { createMock } from "@golevelup/ts-jest"
import { ethers } from "ethers"
import { Repository } from "typeorm"

import { ForbiddenException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { AuthService } from "./auth.service"

import exp = require("constants")

describe("AuthService", () => {
  let repo: Repository<User>
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>()
        }
      ]
    }).compile()

    repo = module.get<Repository<User>>(getRepositoryToken(User))
    service = module.get<AuthService>(AuthService)
  })

  it("should have mocked the repo", () => {
    expect(typeof repo.find).toBe("function")
  })

  describe("AuthService using mock without DI", () => {
    const repo = createMock<Repository<User>>()
    let user: User
    beforeEach(async () => {
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: getRepositoryToken(User),
            useValue: repo
          }
        ]
      }).compile()

      // @ts-expect-error: just using a partial user
      user = {
        publicAddress: "0x0",
        id: 0,
        isActive: false,
        nonce: "helloworld",
        mojangId: "6e6e18ec-7c48-4ec5-881f-f26a28573568",
        dateJoined: new Date("Jul 12 2011"),
        lastLogin: new Date("Jul 12 2011"),
        isSuperUser: false
      }
    })

    it("should have mocked the repo", async () => {
      repo.find.mockResolvedValue([user])

      const foundUser = await repo.find()

      expect(foundUser.at(0) === user)
    })
    it("should call mock on signin", async () => {
      repo.findOneBy.mockResolvedValue(user)

      const nonce = await service.signIn({ publicAddress: "0x0" })

      expect(nonce === user.nonce)
    })
    it("it should create a new user on save", async () => {
      const nonceOfUserToBeSaved = "testNonce"
      // @ts-expect-error: just using a partial user
      repo.save.mockResolvedValue({ nonce: nonceOfUserToBeSaved })
      repo.findOneBy.mockResolvedValue(undefined)

      const nonce = await service.signIn({ publicAddress: "0x0" })

      expect(nonceOfUserToBeSaved === nonce)
    })

    it("shouldnt accept foreign signature", async () => {
      try {
        await service.verify({ publicAddress: "ss", signedNonce: "ss" })
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException)
        expect(error.message).toEqual("Signature is invalid.")
      }
    })

    it("should save valid user with valid nonce", async () => {
      const wallet = ethers.Wallet.createRandom()
      const nonce = "helloNonce"
      const signedNonce = await wallet.signMessage(nonce)
      const publicAddress = await wallet.getAddress()

      const fakeUser: Partial<User> = {
        publicAddress: publicAddress,
        nonce: nonce,
        isActive: false
      }

      // @ts-expect-error: just using a partial user
      repo.findOneBy.mockImplementationOnce(() => fakeUser)
      // @ts-expect-error: just using a partial user
      repo.save.mockResolvedValue({ ...fakeUser, isActive: true })

      const user = await service.verify({ publicAddress, signedNonce })

      expect(user.isActive).toEqual(false)
    })
  })
})
