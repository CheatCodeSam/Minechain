import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class Web3Guard extends AuthGuard('web3') {}
