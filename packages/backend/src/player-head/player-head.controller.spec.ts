import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Test } from '@nestjs/testing'
import { PlayerHeadController } from './player-head.controller'
import { StorageService } from '../storage/storage.service'

describe('PlayerHeadController', () => {
  let playerHeadController: PlayerHeadController
  let storageService: DeepMocked<StorageService>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PlayerHeadController],
    })
      .useMocker(createMock)
      .compile()

      playerHeadController = moduleRef.get(PlayerHeadController)
    storageService = moduleRef.get(StorageService)
  })
  describe('getPlayerHead', () => {
    it('should call getStream with the correct key', async () => {
      const getStreamFunction = storageService.getStream

      await playerHeadController.getPlayerHead("0x2061dd3a9f09186b5CD82436467dDB79dC737227.png")

      expect(getStreamFunction).toBeCalledWith('player-head/0x2061dd3a9f09186b5CD82436467dDB79dC737227.png')
    })
  })
})
