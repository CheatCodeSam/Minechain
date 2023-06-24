import { Test } from '@nestjs/testing'
import { AccountLinkService } from './account-link.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

import { ForbiddenException } from '@nestjs/common'
import { createUser } from '../testing/utils'
import { JwtModule } from '@nestjs/jwt'

describe('AccountLinkService', () => {
  let accountLinkService: AccountLinkService
  let userService: DeepMocked<UserService>
  let amqpConnection: DeepMocked<AmqpConnection>
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: {
            expiresIn: '15m',
            issuer: 'minechain:backend',
            audience: 'minechain:backend',
          },
        }),
      ],
      providers: [AccountLinkService],
    })
      .useMocker(createMock)
      .compile()

    accountLinkService = moduleRef.get<AccountLinkService>(AccountLinkService)
    userService = moduleRef.get(UserService)
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
      const jwtRegex = /^[\w-]+\.[\w-]+\.[\w-]+$/g
      const mojangUUID = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'

      const jwt = await accountLinkService.generateRegistrationToken(mojangUUID)

      expect(jwt.token).toMatch(jwtRegex)
      expect(jwt.uuid).toEqual(mojangUUID)
    })
  })

  describe('isLinked', () => {
    it('should recognize linked account', async () => {
      const findOneFunction = userService.findOne.mockResolvedValue(user)
      const mojangUUID = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'

      const result = await accountLinkService.isLinked(mojangUUID)

      expect(result).toEqual(true)
      expect(findOneFunction).toBeCalledWith({
        mojangId: 'd772f296-60a0-4917-bf8f-7f33ffed41d9',
      })
    })

    it('should recognize not linked account', async () => {
      userService.findOne.mockResolvedValue(null)
      const mojangUUID = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'

      const result = await accountLinkService.isLinked(mojangUUID)

      expect(result).toEqual(false)
    })
  })

  describe('validateRegistration', () => {
    it('should update user if successful account link', async () => {
      const amqpPublishFunction = amqpConnection.publish
      const updateUserMojangIdFunction = userService.updateUserMojangId
      const mojangId = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
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
      const mojangId = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
      user.mojangId = mojangId

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
      user.mojangId = null

      const jwt = 'bogus.jwt.token'

      await expect(
        accountLinkService.validateRegistration(jwt, user)
      ).rejects.toThrowError(new ForbiddenException('Token is invalid.'))
    })
  })
})
