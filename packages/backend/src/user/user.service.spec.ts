import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { createUser } from '../testing/utils'
import { Repository } from 'typeorm'
import { EnsService } from '../blockchain/ens.service'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('MinecraftService', () => {
  let userService: UserService
  let userRepo: DeepMocked<Repository<User>>
  let ensService: DeepMocked<EnsService>

  let user: User

  beforeEach(async () => {
    user = createUser()

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile()

    userService = moduleRef.get<UserService>(UserService)
    userRepo = moduleRef.get(getRepositoryToken(User))
    ensService = moduleRef.get(EnsService)
  })

  describe('activateUser', () => {
    it('should activate the user', async () => {
      user.isActive = false
      const { nonce: oldNonce } = user

      const activatedUser = await userService.activateUser(user.id)

      expect(user.isActive).toEqual(true)
      expect(user.nonce).not.toEqual(oldNonce)
    })
  })

  describe('updateUserMojangId', () => {
    it("should update user's Mojang uuid", async () => {
      user.mojangId = null
      const uuid = '7e8ad72b-2bb8-4708-a09a-e1097b5ba908'

      const userWithNewMojangId = await userService.updateUserMojangId(
        user.id,
        uuid
      )

      expect(userWithNewMojangId.mojangId).toEqual(uuid)
    })
  })

  describe('refreshNonce', () => {
    it('should refresh nonce', async () => {
      const { nonce: oldNonce } = user

      await userService.activateUser(user.id)

      expect(user.nonce).not.toEqual(oldNonce)
    })
  })

  describe('unlinkMinecraftAccount', () => {
    it('should unlink Minecraft account', async () => {
      await userService.unlinkMinecraftAccount(user.id)

      expect(user.mojangId).toEqual(null)
      expect(user.playerHeadRefresh).toEqual(null)
    })
  })

  describe('findOne', () => {
    it('should return null if cannot find user', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null)

      const userNotFound = await userService.findOne({ id: user.id })

      expect(userNotFound).toEqual(null)
    })
  })
})
