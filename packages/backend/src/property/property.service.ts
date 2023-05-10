import { Injectable } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BigNumber } from 'ethers'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'

@Injectable()
export class PropertyService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService
  ) {}

  async findOne(tokenId: number) {
    let property: Property = null
    if (!property) property = await this.updateProperty(tokenId)
    console.log(property.owner);
    
    return property
  }

  // public async priceChange(
  //   owner: string,
  //   tokenId: BigNumber,
  //   oldPrice: BigNumber,
  //   newPrice: BigNumber
  // ) {}

  // public async sold(
  //   from: string,
  //   to: string,
  //   tokenId: BigNumber,
  //   price: BigNumber
  // ) {}

  // public async repossessed(from: string, to: string, tokenId: BigNumber) {}

  private async updateProperty(tokenId: number): Promise<Property> {
    const property = await this.blockchainService.findOne(tokenId)
    const user = await this.userService.findOne({
      publicAddress: property.owner,
    })

    await this.propertyRepo.upsert(
      {
        id: tokenId,
        ownerAddress: property.owner,
        price: property.price.toString(),
        deposit: property.deposit.toString(),
        lastTaxPaidDate: property.lastTaxPaidDate.toString(),
        cumulativePrice: property.cumulativePrice.toString(),
        lastPriceChangeDate: property.lastPriceChangeDate.toString(),
        priceChangeCount: property.priceChangeCount,
        ownerId: user?.id,
      },
      ['id']
    )

    return this.propertyRepo.findOne({ where: {id: tokenId}, relations: ['owner'] })
  }
}
