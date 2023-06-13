import { Test } from '@nestjs/testing'
import { AccountLinkService } from './account-link.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { ConfigService } from '@nestjs/config'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

import { ForbiddenException } from '@nestjs/common'
import { createUser } from '../testing/utils'

describe('AccountLinkService', () => {
  let accountLinkService: AccountLinkService
  let userService: DeepMocked<UserService>
  let configService: DeepMocked<ConfigService>
  let amqpConnection: DeepMocked<AmqpConnection>
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AccountLinkService],
    })
      .useMocker(createMock)
      .compile()

    accountLinkService = moduleRef.get<AccountLinkService>(AccountLinkService)
    userService = moduleRef.get(UserService)
    configService = moduleRef.get(ConfigService)
    amqpConnection = moduleRef.get(AmqpConnection)
    user = createUser({})
  })

  describe('unlinkAccount', () => {
    it('should call unlink account', async () => {
      const mockUser = createUser()
      const unlinkMinecraftAccountFunction =
        userService.unlinkMinecraftAccount.mockResolvedValue(mockUser)

      const unlinkedUser = await accountLinkService.unlinkAccount(user)

      expect(unlinkedUser).toEqual(mockUser)
      expect(unlinkMinecraftAccountFunction).toBeCalledWith(1)
    })
  })

  describe('createJwt', () => {
    it('should create a JWT', async () => {
      configService.get.mockReturnValueOnce('secret')
      const jwtRegex = /^[\w-]+\.[\w-]+\.[\w-]+$/g

      const jwt = await accountLinkService.generateRegistrationToken(
        user.mojangId
      )

      expect(jwt.token).toMatch(jwtRegex)
      expect(jwt.uuid).toEqual(user.mojangId)
    })
  })

  describe('isLinked', () => {
    it('should recognize linked account', async () => {
      const findOneFunction = userService.findOne.mockResolvedValue(user)

      const result = await accountLinkService.isLinked(user.mojangId)

      expect(result).toEqual(true)
      expect(findOneFunction).toBeCalledWith({
        mojangId: 'd772f296-60a0-4917-bf8f-7f33ffed41d9',
      })
    })

    it('should recognize not linked account', async () => {
      userService.findOne.mockResolvedValue(null)

      const result = await accountLinkService.isLinked(user.mojangId)

      expect(result).toEqual(false)
    })
  })

  describe('validateRegistration', () => {
    it('should update user if successful account link', async () => {
      const amqpPublishFunction = amqpConnection.publish
      const updateUserMojangIdFunction = userService.updateUserMojangId
      configService.get.mockReturnValue('secret')
      const mojangId = user.mojangId
      user.mojangId = null

      const jwt = await accountLinkService.generateRegistrationToken(mojangId)

      await accountLinkService.validateRegistration(jwt.token, user)

      expect(amqpPublishFunction).toBeCalledWith(
        'account-link',
        'authorizeJoin',
        { uuid: mojangId }
      )

      expect(updateUserMojangIdFunction).toBeCalledWith(user.id, mojangId)
    })

    it('should throw if user already has linked account', async () => {
      configService.get.mockReturnValueOnce('secret')

      const jwt = await accountLinkService.generateRegistrationToken(
        user.mojangId
      )

      await expect(
        accountLinkService.validateRegistration(jwt.token, user)
      ).rejects.toThrowError(
        new ForbiddenException(
          'User already has linked account, unlink account to reregister'
        )
      )
    })

    it('should throw if token is invalid', async () => {
      configService.get.mockReturnValueOnce('secret')
      user.mojangId = null

      const jwt = 'bogus.jwt.token'

      await expect(
        accountLinkService.validateRegistration(jwt, user)
      ).rejects.toThrowError(new ForbiddenException('Token is invalid.'))
    })
  })
})
