import { Test } from '@nestjs/testing'
import { PropertyService } from './property.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { createUser } from '../testing/utils'
import { BlockchainService } from '../blockchain/blockchain.service'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
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
  return retVal
}

describe('PropertyService', () => {
  let propertyService: PropertyService
  let userService: DeepMocked<UserService>
  let blockchainService: DeepMocked<BlockchainService>
  let amqpConnection: DeepMocked<AmqpConnection>
  let propertyRepo: DeepMocked<Repository<Property>>

  let user: User
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
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile()

    propertyService = moduleRef.get<PropertyService>(PropertyService)
    userService = moduleRef.get(UserService)
    blockchainService = moduleRef.get(BlockchainService)
    amqpConnection = moduleRef.get(AmqpConnection)
    propertyRepo = moduleRef.get(getRepositoryToken(Property))

    user = createUser()
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

  describe('getHighestBlocks', () => {
    it('should call the rpc with correct tokenId', async () => {
      const x = amqpConnection.request

      await propertyService.getHighestBlocks(1)

      expect(x).toBeCalledWith({
        exchange: 'minecraft',
        routingKey: 'getBlock',
        payload: {
          tokenId: '1',
        },
        timeout: 10000,
      })
    })
  })
})
