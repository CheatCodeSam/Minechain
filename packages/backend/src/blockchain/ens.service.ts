import { Injectable } from '@nestjs/common';
import { InjectEthersProvider } from 'nestjs-ethers';
import { providers } from 'ethers';

@Injectable()
export class EnsService {

    constructor(
        @InjectEthersProvider('eth')
        private readonly ethProvider: providers.AlchemyProvider,
    ) {}

    public async getEnsName() {
        const str = await this.ethProvider.lookupAddress("0x2061dd3a9f09186b5CD82436467dDB79dC737227")
        return str
    }
}
