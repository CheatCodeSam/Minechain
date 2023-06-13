import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'
import { MojangIdDto } from '../account-link/dto/mojang-id-dto'
import { createUser } from '../testing/utils'

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
      const region = '1'
      const regionEnterDto = { uuid: user.mojangId, region }

      await minecraftProvider.regionEnter(regionEnterDto)

      expect(regionEnterFunction).toBeCalledWith(user.mojangId, region)
    })
  })
})
