import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signIn.dto'

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

describe('AuthController', () => {
  let authService: DeepMocked<AuthService>
  let authController: AuthController
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile()

    authController = moduleRef.get(AuthController)
    authService = moduleRef.get(AuthService)
    user = createUser({})
  })

  describe('signin', () => {
    it('should sign in the user and return the nonce', async () => {
      const nonce = 'mySecretNonce'
      const signInFunction = authService.signIn.mockResolvedValueOnce(nonce)
      const signinDto: SignInDto = { publicAddress: user.publicAddress }

      const result = await authController.signin(signinDto)
      expect(signInFunction).toBeCalledWith(user.publicAddress)
      expect(result).toEqual({ nonce })
    })
  })

  describe('verify', () => {
    it('should return the user', async () => {
      const result = await authController.verify(user)

      expect(result).toEqual(user)
    })
  })
})
