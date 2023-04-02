import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { User } from './user.entity'
import { generate as generateShortUuid } from 'short-uuid'
import { EnsService } from '../blockchain/ens.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly ensService: EnsService
  ) {}

  async activateUser(id: number) {
    const user = await this.findOne({ id })
    user.isActive = true
    user.nonce = generateShortUuid()
    return this.userRepo.save(user)
  }

  async updateUserMojangId(id: number, uuid: string) {
    const user = await this.findOne({ id })
    user.mojangId = uuid
    return this.userRepo.save(user)
  }

  async createUser(publicAddress: string) {
    let newUser = this.userRepo.create({ publicAddress })
    await this.updateEns(newUser)
    return this.userRepo.save(newUser)
  }

  async refreshNonce(id: number) {
    const user = await this.findOne({ id })
    user.nonce = generateShortUuid()
    return this.userRepo.save(user)
  }

  async findOne(findOperators: FindOptionsWhere<User>) {
    const user = await this.userRepo.findOne({ where: findOperators })
    if(user) await this.updateEnsNameIfNeeded(user)
    return user;
  }

  async unlinkMinecraftAccount(id: number) {
    const user = await this.findOne({ id })
    user.mojangId = null
    return this.userRepo.save(user)
  }

  private async updateEnsNameIfNeeded(user: User) {
    if (user.ensRefresh.getTime() < Date.now()) {
      await this.updateEns(user)
      user.save()
    }
    return user
  }

  private async updateEns(user: User)
  {
    user.ensName = await this.ensService.getEnsName(user.publicAddress)
    // Three Days
    user.ensRefresh = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  }
}
