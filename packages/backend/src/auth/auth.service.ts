import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ethers } from 'ethers';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(publicAddress : string) {
    const existingUser = await this.userService.findOne({ publicAddress });
    if (existingUser) {
      return existingUser.nonce;
    } else {
      const user = await this.userService.createUser(publicAddress);
      return user.nonce;
    }
  }

  async verify(publicAddress: string, signedNonce: string) {
    if (!this.isValidSignature(signedNonce))
      throw new ForbiddenException('Signature is invalid.');
    const user = await this.userService.findOne({ publicAddress });
    if (!user)
      throw new NotFoundException('User with public address does not exist.');

    const decodedAddress = ethers.utils.verifyMessage(user.nonce, signedNonce);
    if (publicAddress.toLowerCase() === decodedAddress.toLowerCase()) {
      return this.userService.activateUser(user.id);
    } else {
      throw new ForbiddenException('Invalid public address.');
    }
  }

  private isValidSignature(signature: string): boolean {
    try {
      ethers.utils.splitSignature(signature);
    } catch (error) {
      return false;
    }
    return true;
  }
}
