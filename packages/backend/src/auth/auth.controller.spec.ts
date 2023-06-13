import { Test } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signIn.dto'
import { createUser } from '../testing/utils'

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
