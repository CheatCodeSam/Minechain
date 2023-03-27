import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Web3Guard } from './guard/web3.guard';
import { Session as ExpressSession } from 'express-session';
import { CurrentUser } from '../user/decorator/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async signin(@Body() publicAddress: SignInDto) {
    const nonce = await this.authService.signIn(publicAddress.publicAddress);
    return { nonce: nonce };
  }

  @Post('verify')
  @UseGuards(Web3Guard)
  @HttpCode(HttpStatus.ACCEPTED)
  async verify(@CurrentUser() user: User) {
    return user;
  }

  @Post('logout')
  logout(@Session() req: ExpressSession) {
    req.destroy(() => '');
    return;
  }
}
