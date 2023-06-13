import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { createUser } from '../testing/utils'
import { Repository } from 'typeorm'
import { EnsService } from '../blockchain/ens.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PlayerHeadService } from '../player-head/player-head.service'

describe('MinecraftService', () => {
  let userService: UserService
  let userRepo: DeepMocked<Repository<User>>
  let ensService: DeepMocked<EnsService>
  let playerHeadService: DeepMocked<PlayerHeadService>

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
            create: jest.fn().mockReturnValue(user),
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
    playerHeadService = moduleRef.get(PlayerHeadService)
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
      const getPlayerHeadFunction = playerHeadService.getPlayerHead

      const userWithNewMojangId = await userService.updateUserMojangId(
        user.id,
        uuid
      )

      expect(getPlayerHeadFunction).toBeCalledWith(user)
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
    it('should return user', async () => {
      const yearFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
      const getEnsNameFunction = ensService.getEnsName
      const getPlayerHeadFunction = playerHeadService.getPlayerHead
      user.ensRefresh = yearFromNow
      user.playerHeadRefresh = yearFromNow

      const foundUser = await userService.findOne({ id: user.id })
      expect(getEnsNameFunction).not.toBeCalled()
      expect(getPlayerHeadFunction).not.toBeCalled()
      expect(foundUser).toEqual(user)
    })
    it('should refresh ens name while getting user', async () => {
      const yearInPast = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
      const yearFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
      const getEnsNameFunction =
        ensService.getEnsName.mockResolvedValueOnce('newname.eth')
      const getPlayerHeadFunction = playerHeadService.getPlayerHead

      user.ensRefresh = yearInPast
      user.playerHeadRefresh = yearFromNow

      const foundUser = await userService.findOne({ id: user.id })

      expect(getPlayerHeadFunction).not.toBeCalled()
      expect(getEnsNameFunction).toBeCalledWith(user.publicAddress)
      expect(foundUser?.ensName).toEqual('newname.eth')
      expect(foundUser?.ensRefresh.getTime()).toBeGreaterThan(Date.now())
    })

    it('should refresh player head while getting user', async () => {
      const yearInPast = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
      const yearFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
      const getEnsNameFunction = ensService.getEnsName
      const getPlayerHeadFunction =
        playerHeadService.getPlayerHead.mockResolvedValueOnce('steve.png')

      user.ensRefresh = yearFromNow
      user.playerHeadRefresh = yearInPast

      const foundUser = await userService.findOne({ id: user.id })

      expect(getEnsNameFunction).not.toBeCalled()
      expect(getPlayerHeadFunction).toBeCalledWith(user)
      expect(foundUser?.playerHeadKey).toEqual('steve.png')
      expect(foundUser?.playerHeadRefresh.getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserFunction = jest.spyOn(userRepo, 'create')
      const getEnsNameFunction = ensService.getEnsName
      const publicAddress = '0x2061dd3a9f09186b5CD82436467dDB79dC737227'

      await userService.createUser(publicAddress)

      expect(createUserFunction).toBeCalledWith({
        publicAddress: publicAddress.toLowerCase(),
      })
      expect(getEnsNameFunction).toBeCalledWith(publicAddress)
    })
  })
})
