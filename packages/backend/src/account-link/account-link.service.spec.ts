// @ts-nocheck
import { Test } from '@nestjs/testing'
import { AccountLinkService } from './account-link.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { ConfigService } from '@nestjs/config'

const createUser = (user: Partial<User> = {}) => {
  const retVal = new User()
  retVal.id = user.id || 1
  retVal.isActive = user.isActive || true
  retVal.nonce = user.nonce || 'randomNonce'
  retVal.publicAddress =
    user.publicAddress || '0x2061dd3a9f09186b5CD82436467dDB79dC737227'
  retVal.mojangId = user.mojangId || 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
  retVal.lastKnownRegion = user.lastKnownRegion || '1'
  retVal.dateJoined = user.dateJoined || new Date()
  retVal.lastLogin = user.lastLogin || new Date()
  retVal.isSuperUser = user.isSuperUser || true
  retVal.ensName = user.ensName || 'carsonweeks.eth'
  retVal.ensRefresh = user.ensRefresh || new Date()
  retVal.playerHeadKey = user.playerHeadKey || 'playerHeadKey123.png'
  retVal.playerHeadRefresh = user.playerHeadRefresh || new Date()
  retVal.properties = user.properties || []
  return retVal
}

describe('CatsController', () => {
  let accountLinkService: AccountLinkService
  let userService: DeepMocked<UserService>
  let configService: DeepMocked<ConfigService>
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
    user = createUser({})
  })

  describe('accountLinkService', () => {
    it('should call unlink account', async () => {
      const mockUser = createUser()
      const unlinkMinecraftAccountFunction =
        userService.unlinkMinecraftAccount.mockResolvedValue(mockUser)

      const unlinkedUser = await accountLinkService.unlinkAccount(user)

      expect(unlinkedUser).toEqual(mockUser)
      expect(unlinkMinecraftAccountFunction).toBeCalledWith(1)
    })

    it('should create a JWT', async () => {
      configService.get.mockReturnValueOnce('secret')
      const jwtRegex = /^[\w-]+\.[\w-]+\.[\w-]+$/g

      const jwt = await accountLinkService.generateRegistrationToken(
        user.mojangId
      )

      expect(jwt.token).toMatch(jwtRegex)
      expect(jwt.uuid).toEqual(user.mojangId)
    })

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
})
