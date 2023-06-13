import { Test } from '@nestjs/testing'
import { AccountLinkProvider } from './account-link.provider'
import { DeepMocked, createMock } from '@golevelup/ts-jest'

import { AccountLinkService } from './account-link.service'
import { MojangIdDto } from './dto/mojang-id-dto'

describe('AccountLinkProvider', () => {
  let accountLinkProvider: AccountLinkProvider
  let accountLinkService: DeepMocked<AccountLinkService>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AccountLinkProvider],
    })
      .useMocker(createMock)
      .compile()

    accountLinkProvider = moduleRef.get(AccountLinkProvider)
    accountLinkService = moduleRef.get(AccountLinkService)
  })

  describe('generateRegistrationToken', () => {
    it('should generate registration token', async () => {
      const generateRegistrationTokenFunction =
        accountLinkService.generateRegistrationToken
      const uuid = '556bb134-44d8-4de7-ab88-e72e3e833f6f'
      const mojangIdDto: MojangIdDto = { uuid }

      accountLinkProvider.generateRegistrationToken(mojangIdDto)

      expect(generateRegistrationTokenFunction).toBeCalledWith(uuid)
    })
  })

  describe('isLinked', () => {
    it('should check if account is linked', async () => {
      const isLinkedFunction = accountLinkService.isLinked
      const uuid = '556bb134-44d8-4de7-ab88-e72e3e833f6f'
      const mojangIdDto: MojangIdDto = { uuid }

      accountLinkProvider.isLinked(mojangIdDto)

      expect(isLinkedFunction).toBeCalledWith(uuid)
    })
  })
})
