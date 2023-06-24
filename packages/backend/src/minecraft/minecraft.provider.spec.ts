import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'
import { MojangIdDto } from '../account-link/dto/mojang-id-dto'

describe('MinecraftProvider', () => {
  let minecraftService: DeepMocked<MinecraftService>
  let minecraftProvider: MinecraftProvider
  let mojangUUID: string

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MinecraftProvider],
    })
      .useMocker(createMock)
      .compile()

    minecraftProvider = moduleRef.get(MinecraftProvider)
    minecraftService = moduleRef.get(MinecraftService)
    mojangUUID = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
  })

  describe('getUser', () => {
    it('should call the getUser function', async () => {
      const getUserFunction = minecraftService.getUser
      const mojangIdDto: MojangIdDto = { uuid: mojangUUID }

      await minecraftProvider.authenticate(mojangIdDto)

      expect(getUserFunction).toBeCalledWith(mojangUUID)
    })
  })

  describe('playerLeave', () => {
    it('should call player leave', async () => {
      const playerLeaveFunction = minecraftService.playerLeave
      const mojangId = { uuid: mojangUUID }

      await minecraftProvider.playerLeave(mojangId)

      expect(playerLeaveFunction).toBeCalledWith(mojangUUID)
    })
  })

  describe('regionEnter', () => {
    it('should call region enter', async () => {
      const regionEnterFunction = minecraftService.regionEnter
      const region = '1'
      const regionEnterDto = { uuid: mojangUUID, region }

      await minecraftProvider.regionEnter(regionEnterDto)

      expect(regionEnterFunction).toBeCalledWith(mojangUUID, region)
    })
  })
})
