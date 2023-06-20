import { Injectable } from '@nestjs/common'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './../property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../../user/user.service'

@Injectable()
export class PropertySyncService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService
  ) {}

  public async syncSinglePropertyById(tokenId: number) {
    await this.sync(tokenId)
  }

  public async syncProperties(properties: Property[]) {
    const propertyPromises = properties.map((propertiy) =>
      this.sync(propertiy.id)
    )
    await Promise.all(propertyPromises)
  }

  private async sync(tokenId: number) {
    const property = await this.blockchainService.findOne(tokenId)
    let user = await this.userService.findOne({
      publicAddress: property.owner.toLowerCase(),
    })
    if (!user)
      user = await this.userService.createUser(property.owner.toLowerCase())
    await this.propertyRepo.upsert(
      {
        id: tokenId,
        ownerAddress: property.owner.toLowerCase(),
        price: property.price.toString(),
        deposit: property.deposit.toString(),
        lastTaxPaidDate: property.lastTaxPaidDate.toString(),
        cumulativePrice: property.cumulativePrice.toString(),
        lastPriceChangeDate: property.lastPriceChangeDate.toString(),
        priceChangeCount: property.priceChangeCount,
        ownerId: user.id,
      },
      ['id']
    )
  }
}
