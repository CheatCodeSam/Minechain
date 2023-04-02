import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { generate as generateShortUuid } from 'short-uuid';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async activateUser(id: number) {
    const user = await this.findOne({id})
    user.isActive = true
    user.nonce = generateShortUuid();
    return this.userRepo.save(user)
  }

  async updateUserMojangId(id: number, uuid: string)
  {
    const user = await this.findOne({id})
    user.mojangId = uuid
    return this.userRepo.save(user)
  }

  async createUser(publicAddress: string) {
    const newUser = this.userRepo.create({ publicAddress });
    return this.userRepo.save(newUser);
  }

  async refreshNonce(id: number) {
    const user = await this.findOne({ id });
    user.nonce = generateShortUuid();
    return this.userRepo.save(user);
  }

  async findOne(findOperators: FindOptionsWhere<User>) {
    return this.userRepo.findOne({ where: findOperators });
  }

  async unlinkMinecraftAccount(id: number) {
    const user = await this.findOne({id})
    user.mojangId = null
    return this.userRepo.save(user)
  }

}
