import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { PropertyService } from './property.service'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { PropertyFindService } from './property-find.service'
import { PropertySyncService } from './property-sync.service'
import { createUser } from '../../testing/utils'
import { User } from '../../user/user.entity'
import { Property } from '../property.entity'

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

describe('MinecraftService', () => {
  let propertyService: PropertyService
  let propertyFindService: DeepMocked<PropertyFindService>
  let propertySyncService: DeepMocked<PropertySyncService>
  let amqpConnection: DeepMocked<AmqpConnection>

  let user: User
  let property: Property

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PropertyService],
    })
      .useMocker(createMock)
      .compile()

    propertyService = moduleRef.get<PropertyService>(PropertyService)
    propertyFindService = moduleRef.get(PropertyFindService)
    propertySyncService = moduleRef.get(PropertySyncService)
    amqpConnection = moduleRef.get(AmqpConnection)

    user = createUser()
    property = createProperty()
  })

  describe('initialize', () => {
    it('should initialize all properties if no properties are in the database', async () => {
      propertyFindService.findAll.mockResolvedValue({ data: [], count: 0 })
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById

      await propertyService.initialize()

      expect(syncSinglePropertyByIdFunction).toBeCalledTimes(1024)
    })
    it('should initialize all properties if not all properties are in database', async () => {
      propertyFindService.findAll.mockResolvedValue({ data: [], count: 1023 })
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById

      await propertyService.initialize()

      expect(syncSinglePropertyByIdFunction).toBeCalledTimes(1024)
    })
    it('should not initialize if all properties are in database', async () => {
      propertyFindService.findAll.mockResolvedValue({ data: [], count: 1024 })
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById

      await propertyService.initialize()

      expect(syncSinglePropertyByIdFunction).not.toBeCalled()
    })
  })
  describe('accountLink', () => {
    it('should synchronize properties and emit updates', async () => {
      const propertyArray = [property]
      const findFunction = propertyFindService.find.mockResolvedValue({
        data: propertyArray,
        count: 1,
      })
      const syncPropertiesFunction = propertySyncService.syncProperties
      const publishFunction = amqpConnection.publish

      await propertyService.accountLink(user)

      expect(findFunction).toBeCalledWith(1024, 0, {
        ownerAddress: user.publicAddress,
      })
      expect(syncPropertiesFunction).toBeCalledWith(propertyArray)
      expect(publishFunction).toBeCalled()
    })
    it('should not properties if none are found', async () => {
      propertyFindService.find.mockResolvedValue({
        data: [],
        count: 0,
      })
      const syncPropertiesFunction = propertySyncService.syncProperties
      const publishFunction = amqpConnection.publish

      await propertyService.accountLink(user)

      expect(publishFunction).not.toBeCalled()
      expect(syncPropertiesFunction).not.toBeCalled()
    })
  })
  describe('sold', () => {
    it('should synchronize property and emit update', async () => {
      const findOneFunction =
        propertyFindService.findOne.mockResolvedValue(property)
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById
      const publishFunction = amqpConnection.publish

      const retVal = await propertyService.sold(1)

      expect(findOneFunction).toBeCalledWith(1)
      expect(syncSinglePropertyByIdFunction).toBeCalledWith(1)
      expect(publishFunction).toBeCalled()
      expect(retVal).toEqual(property)
    })
  })
  describe('repossessed', () => {
    it('should should synchronize property and emit update', async () => {
      const findOneFunction =
        propertyFindService.findOne.mockResolvedValue(property)
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById
      const publishFunction = amqpConnection.publish

      const retVal = await propertyService.repossessed(1)

      expect(findOneFunction).toBeCalledWith(1)
      expect(syncSinglePropertyByIdFunction).toBeCalledWith(1)
      expect(publishFunction).toBeCalled()
      expect(retVal).toEqual(property)
    })
  })
  describe('priceChange', () => {
    it('should synchronize property and emit update', async () => {
      const findOneFunction =
        propertyFindService.findOne.mockResolvedValue(property)
      const syncSinglePropertyByIdFunction =
        propertySyncService.syncSinglePropertyById
      const publishFunction = amqpConnection.publish

      const retVal = await propertyService.priceChange(1)

      expect(findOneFunction).toBeCalledWith(1)
      expect(syncSinglePropertyByIdFunction).toBeCalledWith(1)
      expect(publishFunction).toBeCalled()
      expect(retVal).toEqual(property)
    })
  })
  describe('find', () => {
    it('should find properties', async () => {
      const findFunction = propertyFindService.find
      await propertyService.find(1, 0)

      expect(findFunction).toBeCalledWith(1, 0, {})
    })
  })
  describe('findOne', () => {
    it('should find property', async () => {
      const findOneFunction = propertyFindService.findOne

      await propertyService.findOne(1)

      expect(findOneFunction).toBeCalledWith(1)
    })
  })
})