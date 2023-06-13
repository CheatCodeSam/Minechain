import { Test } from '@nestjs/testing'
import { PropertyService } from './property.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { createUser } from '../testing/utils'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'

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
  retVal.propertyRenderKey = "null.png"
  return retVal
}

describe('PropertyService', () => {
  let propertyService: PropertyService

  let propertyRepo: DeepMocked<Repository<Property>>

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
  })

  describe('findAll', () => {
    it('should call findAndCount with correct take and skip', async () => {
      const take = 20
      const skip = 20
      const findAndCountFunction = propertyRepo.findAndCount

      const foundProperty = await propertyService.findAll(take, skip)

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

      const foundProperty = await propertyService.findAll(null, null)

      expect(foundProperty).toBeDefined()
      expect(foundProperty?.count).toEqual(1)
      expect(foundProperty?.data.length).toEqual(1)
      expect(findAndCountFunction).toBeCalledWith({
        order: { id: 'ASC' },
        take: 10,
        skip: 0,
      })
    })
  })


})
