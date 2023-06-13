import { Test, TestingModule } from '@nestjs/testing'
import { PropertyRenderService } from './property-render.service'
import { createMock } from '@golevelup/ts-jest'

describe('PropertyRenderService', () => {
  let service: PropertyRenderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyRenderService],
    })
    .useMocker(createMock)
    .compile()

    service = module.get<PropertyRenderService>(PropertyRenderService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
