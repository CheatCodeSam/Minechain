import { Test } from '@nestjs/testing'
import { PropertyService } from './property.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { createUser } from '../testing/utils'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { PropertyRenderService } from '../property-render/property-render.service'

const createProperty = (): Property => {
  const retVal = new Property()
  retVal.id = 1
  retVal.ownerAddress = '0x2061dd3a9f09186b5CD82436467dDB79dC737227'
  retVal.ownerId = 1
  retVal.price = '123'
  retVal.deposit = '0'
  retVal.lastTaxPaidDate = '1686685665'
  retVal.lastPriceChangeDate = '1686685665'
  retVal.cumulativePrice = '123'
  retVal.priceChangeCount = 0
  retVal.owner = createUser()
  retVal.propertyRenderRefresh = new Date()
  retVal.propertyRenderKey = 'null.png'
  return retVal
}

describe('PropertyService', () => {
  let propertyService: PropertyService

  let propertyRepo: DeepMocked<Repository<Property>>
  let propertyRenderService: DeepMocked<PropertyRenderService>

  let property: Property

  beforeEach(async () => {
    property = createProperty()

    const moduleRef = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(property),
            findAndCount: jest.fn().mockReturnValue([[property], 1]),
            findOne: jest.fn().mockResolvedValue(property),
            save: jest.fn().mockResolvedValue(property),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile()

    propertyService = moduleRef.get<PropertyService>(PropertyService)
    propertyRenderService = moduleRef.get(PropertyRenderService)
    propertyRepo = moduleRef.get(getRepositoryToken(Property))
  })

  describe('findOne', () => {
    it('should call findbyone with the tokenid', async () => {
      const findByOneFunction = propertyRepo.findOneBy

      const foundProperty = await propertyService.findOne(1)

      expect(foundProperty).toBeDefined()
      expect(foundProperty?.id).toEqual(1)
      expect(findByOneFunction).toBeCalledWith({ id: 1 })
    })

    it('should not rerender the property', async () => {
      const yearFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
      const getPropertyRenderFunction = propertyRenderService.getPropertyRender
      property.propertyRenderRefresh = yearFromNow

      const foundProperty = await propertyService.findOne(1)

      expect(getPropertyRenderFunction).not.toBeCalled()
      expect(foundProperty).toEqual(property)
    })

    it('should rerender the property if date is expired', async () => {
      const yearInPast = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )

      property.propertyRenderRefresh = yearInPast

      const getPropertyRenderFunction =
        propertyRenderService.getPropertyRender.mockResolvedValue('key.png')

      const foundProperty = await propertyService.findOne(1)

      expect(getPropertyRenderFunction).toBeCalled()
      expect(foundProperty).toEqual(property)
      expect(foundProperty?.propertyRenderKey).toEqual('key.png')
      expect(foundProperty?.propertyRenderRefresh.getTime()).toBeGreaterThan(
        Date.now()
      )
    })

    it('should render the property if it has never been rendered before', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: 2322
      property.propertyRenderRefresh = null
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: 2322
      property.propertyRenderKey = null

      const getPropertyRenderFunction =
        propertyRenderService.getPropertyRender.mockResolvedValue('key.png')

      const foundProperty = await propertyService.findOne(1)

      expect(getPropertyRenderFunction).toBeCalled()
      expect(foundProperty).toEqual(property)
      expect(foundProperty?.propertyRenderKey).toBeDefined()
      expect(foundProperty?.propertyRenderRefresh).toBeDefined()
      expect(foundProperty?.propertyRenderKey).toEqual('key.png')
      expect(foundProperty?.propertyRenderRefresh.getTime()).toBeGreaterThan(
        Date.now()
      )
    })
  })

  describe('find', () => {
    it('should call findAndCount with correct take and skip', async () => {
      const take = 20
      const skip = 20
      const findAndCountFunction = propertyRepo.findAndCount

      const foundProperty = await propertyService.find(take, skip, undefined)

      expect(foundProperty).toBeDefined()
      expect(foundProperty?.count).toEqual(1)
      expect(foundProperty?.data.length).toEqual(1)
      expect(findAndCountFunction).toBeCalledWith({
        order: { id: 'ASC' },
        take,
        skip,
      })
    })

    it('should call findAndCount with default take and skip', async () => {
      const findAndCountFunction = propertyRepo.findAndCount

      const foundProperty = await propertyService.find(null, null, undefined)

      expect(foundProperty).toBeDefined()
      expect(foundProperty?.count).toEqual(1)
      expect(foundProperty?.data.length).toEqual(1)
      expect(findAndCountFunction).toBeCalledWith({
        order: { id: 'ASC' },
        take: 10,
        skip: 0,
      })
    })

    it('should call render property if needed', async () => {

      const yearInPast = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
      const getPropertyRenderFunction =
        propertyRenderService.getPropertyRender.mockResolvedValue('key.png')
      property.propertyRenderRefresh = yearInPast

      const foundProperty = await propertyService.find(null, null, undefined)

      expect(foundProperty).toBeDefined()
      expect(foundProperty?.count).toEqual(1)
      expect(getPropertyRenderFunction).toBeCalled()
      expect(foundProperty.data[0].propertyRenderKey).toEqual('key.png')
    })
  })
})
