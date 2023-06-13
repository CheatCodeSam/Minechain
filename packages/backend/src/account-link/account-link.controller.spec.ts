import { Test } from '@nestjs/testing'
import { AccountLinkController } from './account-link.controller'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'

import { AccountLinkService } from './account-link.service'
import { RegisterTokenDto } from './dto/register-token.dto'
import { createUser } from '../testing/utils'

describe('AccountLinkController', () => {
  let accountLinkController: AccountLinkController
  let accountLinkService: DeepMocked<AccountLinkService>
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountLinkController],
    })
      .useMocker(createMock)
      .compile()

    accountLinkController = moduleRef.get(AccountLinkController)
    accountLinkService = moduleRef.get(AccountLinkService)
    user = createUser({})
  })
  describe('register', () => {
    it('should validate user registration', async () => {
      const validateRegistrationFunction =
        accountLinkService.validateRegistration
      const token = 'bogus.dto.token'
      const registerDto: RegisterTokenDto = { token }

      accountLinkController.register(registerDto, user)

      expect(validateRegistrationFunction).toBeCalledWith(token, user)
    })
  })

  describe('unlink', () => {
    it('should unlink account', async () => {
      const unlinkAccountFunction = accountLinkService.unlinkAccount

      accountLinkController.unlink(user)

      expect(unlinkAccountFunction).toBeCalledWith(user)
    })
  })
})
