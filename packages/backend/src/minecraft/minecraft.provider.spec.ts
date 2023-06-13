import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'
import { MojangIdDto } from '../account-link/dto/mojang-id-dto'

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

describe('MinecraftProvider', () => {
  let minecraftService: DeepMocked<MinecraftService>
  let minecraftProvider: MinecraftProvider
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MinecraftProvider],
    })
      .useMocker(createMock)
      .compile()

    minecraftProvider = moduleRef.get(MinecraftProvider)
    minecraftService = moduleRef.get(MinecraftService)
    user = createUser()
  })

  describe('getUser', () => {
    it('should call the getUser function', async () => {
        const getUserFunction = minecraftService.getUser
        const mojangIdDto: MojangIdDto = { uuid: user.mojangId }

        await minecraftProvider.authenticate(mojangIdDto)

        expect(getUserFunction).toBeCalledWith(user.mojangId)
    })
  })

  describe('playerLeave', () => {
    it('should call player leave', async () => {
        const playerLeaveFunction = minecraftService.playerLeave
        const mojangId = { uuid: user.mojangId }

        await minecraftProvider.playerLeave(mojangId)

        expect(playerLeaveFunction).toBeCalledWith(user.mojangId)
    })
  })

  describe('regionEnter', () => {
    it('should call region enter', async () => {
        const regionEnterFunction = minecraftService.regionEnter
        const region = "1"
        const regionEnterDto = { uuid: user.mojangId, region }

        await minecraftProvider.regionEnter(regionEnterDto)

        expect(regionEnterFunction).toBeCalledWith(user.mojangId, region)
    })
  })

})
