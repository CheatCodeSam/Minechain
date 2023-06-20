import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from '../property.entity'
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm'

import { PropertyRenderService } from '../../property-render/property-render.service'
import { instanceToPlain } from 'class-transformer'
import { User } from '../../user/user.entity'

@Injectable()
export class PropertyFindService {
  private readonly logger = new Logger(PropertyFindService.name)

  private readonly typeOrmOptions: FindOneOptions<Property> = {
    order: { id: 'ASC' },
    relations: ['owner'],
  }

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly propertyRenderService: PropertyRenderService
  ) {}

  public async findOne(tokenId: number) {
    let property = await this.propertyRepo.findOne({
      ...this.typeOrmOptions,
      where: { id: tokenId },
    })
    if (property) {
      property = await this.updatePropertyRenderIfNeeded(property)
    }
    return property
  }

  public async find(
    take: number | null,
    skip: number | null,
    where: FindOptionsWhere<Property> | null
  ) {
    take = take || 10
    skip = skip || 0
    where = where || {}
    const [result, total] = await this.propertyRepo.findAndCount({
      where: where,
      take: take,
      skip: skip,
      ...this.typeOrmOptions,
    })

    const updatedProperties = result.map(async (p) => {
      const updatedRender = await this.updatePropertyRenderIfNeeded(p)
      updatedRender.owner = instanceToPlain(updatedRender.owner) as User
      return updatedRender
    })
    const awaitedPromises = await Promise.all(updatedProperties)
    return {
      data: awaitedPromises,
      count: total,
    }
  }

  public async findAll() {
    const [result, total] = await this.propertyRepo.findAndCount(
      this.typeOrmOptions
    )
    return {
      data: result,
      count: total,
    }
  }

  private async updatePropertyRenderIfNeeded(property: Property) {
    if (
      !property.propertyRenderRefresh ||
      property.propertyRenderRefresh.getTime() < Date.now()
    ) {
      await this.updatePropertyRender(property)
      return this.propertyRepo.save(property)
    }
    return property
  }

  private async updatePropertyRender(property: Property) {
    let key: null | string = null

    try {
      key = await this.propertyRenderService.getPropertyRender(property.id)
    } catch (error: unknown) {
      const knownError = error as RequestTimeoutException
      this.logger.warn(`"${knownError.message}" is the Minecraft server on?`)
    }
    property.propertyRenderKey = key
    // 15 Minutes
    property.propertyRenderRefresh = new Date(
      new Date().getTime() + 15 * 60 * 1000
    )
  }
}
