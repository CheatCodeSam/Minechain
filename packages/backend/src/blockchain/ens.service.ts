import { Injectable } from '@nestjs/common'
import { InjectEthersProvider } from './nestjs-ethers'
import { providers } from 'ethers'

@Injectable()
export class EnsService {
  constructor(
    @InjectEthersProvider('eth')
    private readonly ethProvider: providers.AlchemyProvider
  ) {}

  public async getEnsName(publicAddress: string) {
    return this.ethProvider.lookupAddress(publicAddress)
  }
}
