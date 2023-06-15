import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Test } from '@nestjs/testing'
import { PropertyRenderController } from './property-render.controller'
import { StorageService } from '../storage/storage.service'

describe('PropertyRenderController', () => {
  let propertyRenderController: PropertyRenderController
  let storageService: DeepMocked<StorageService>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PropertyRenderController],
    })
      .useMocker(createMock)
      .compile()

    propertyRenderController = moduleRef.get(PropertyRenderController)
    storageService = moduleRef.get(StorageService)
  })
  describe('getPlayerHead', () => {
    it('should call getStream with the correct key', async () => {
      const getStreamFunction = storageService.getStream

      await propertyRenderController.getPropertyRender('1.png')

      expect(getStreamFunction).toBeCalledWith('property-render/1.png')
    })
  })
})
