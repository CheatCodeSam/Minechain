import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { User } from './user.entity'
import { generate as generateShortUuid } from 'short-uuid'
import { EnsService } from '../blockchain/ens.service'
import { PlayerHeadService } from '../player-head/player-head.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly ensService: EnsService,
    private readonly playerHeadService: PlayerHeadService
  ) {}

  async activateUser(id: number): Promise<User> {
    const user = await this.findOne({ id })
    user.isActive = true
    user.nonce = generateShortUuid()
    return this.userRepo.save(user)
  }

  async updateUserMojangId(id: number, uuid: string): Promise<User> {
    const user = await this.findOne({ id })
    user.mojangId = uuid
    await this.updatePlayerHead(user)
    return this.userRepo.save(user)
  }

  async createUser(publicAddress: string): Promise<User> {
    const newUser = this.userRepo.create({
      publicAddress: publicAddress.toLowerCase(),
    })
    await this.updateEns(newUser)
    return this.userRepo.save(newUser)
  }

  async refreshNonce(id: number): Promise<User> {
    const user = await this.findOne({ id })
    user.nonce = generateShortUuid()
    return this.userRepo.save(user)
  }

  async findOne(findOperators: FindOptionsWhere<User>) {
    const user = await this.userRepo.findOne({
      where: findOperators,
      relations: ['properties'],
    })
    if (user) {
      await this.updateEnsNameIfNeeded(user)
      if (user.mojangId) await this.updatePlayerHeadIfNeeded(user)
    }
    return user
  }

  async unlinkMinecraftAccount(id: number): Promise<User> {
    const user = await this.findOne({ id })
    user.mojangId = null
    user.playerHeadRefresh = null
    return this.userRepo.save(user)
  }

  private async updateEnsNameIfNeeded(user: User) {
    if (user.ensRefresh?.getTime() < Date.now()) {
      await this.updateEns(user)
      this.userRepo.save(user)
    }
  }

  async updateEns(user: User) {
    user.ensName = await this.ensService.getEnsName(user.publicAddress)
    // Three Days
    user.ensRefresh = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  }

  private async updatePlayerHeadIfNeeded(user: User) {
    if (user.playerHeadRefresh?.getTime() < Date.now()) {
      await this.updatePlayerHead(user)
      this.userRepo.save(user)
    }
  }

  async updatePlayerHead(user: User) {
    const key = await this.playerHeadService.getPlayerHead(user)
    user.playerHeadKey = key
    // Three Days
    user.playerHeadRefresh = new Date(
      new Date().getTime() + 3 * 24 * 60 * 60 * 1000
    )
  }
}
