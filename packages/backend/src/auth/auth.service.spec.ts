import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { JwtService } from '@nestjs/jwt'

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

describe('AuthService', () => {
  let authService: AuthService
  let userService: DeepMocked<UserService>
  let jwtService: DeepMocked<JwtService>
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile()

    authService = moduleRef.get<AuthService>(AuthService)
    userService = moduleRef.get(UserService)
    jwtService = moduleRef.get(JwtService)

    user = createUser()
  })

  describe('signIn', () => {
    it('should return the nonce of an existing user', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const createUserFunction = userService.createUser
      const publicAddress =
        '0x2061dd3a9f09186b5CD82436467dDB79dC737227'.toLowerCase()

      const nonce = await authService.signIn(publicAddress)

      expect(createUserFunction).not.toHaveBeenCalled()
      expect(findOneFunction).toBeCalledWith({ publicAddress })
      expect(nonce).toEqual('randomNonce')
    })

    it('should create a user than return a nonce', async () => {
      userService.findOne.mockResolvedValueOnce(null)
      const createUserFunction = userService.createUser.mockResolvedValue(user)
      const publicAddress = '0x2061dd3a9f09186b5CD82436467dDB79dC737227'

      const nonce = await authService.signIn(publicAddress)

      expect(createUserFunction).toHaveBeenCalled()
      expect(nonce).toEqual('randomNonce')
    })
  })
})
