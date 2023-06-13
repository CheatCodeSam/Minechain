import { Test } from '@nestjs/testing'
import { AccountLinkController } from './account-link.controller'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'

import { AccountLinkService } from './account-link.service'
import { RegisterTokenDto } from './dto/register-token.dto'

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

describe('accountLinkController', () => {
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

  it('should validate user registration', async () => {
    const validateRegistrationFunction = accountLinkService.validateRegistration
    const token = 'bogus.dto.token'
    const registerDto: RegisterTokenDto = { token }

    accountLinkController.register(registerDto, user)

    expect(validateRegistrationFunction).toBeCalledWith(token, user)
  })

  it('should unlink account', async () => {
    const unlinkAccountFunction = accountLinkService.unlinkAccount

    accountLinkController.unlink(user)

    expect(unlinkAccountFunction).toBeCalledWith(user)
  })
})
