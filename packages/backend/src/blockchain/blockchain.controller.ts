import { Controller, Get } from '@nestjs/common';
import { EthersContract, InjectContractProvider, InjectEthersProvider } from 'nestjs-ethers';
import {BigNumber, ethers} from "ethers"
import { abi, Lock } from '@minechain/eth-types';

@Controller('blockchain')
export class BlockchainController {
    constructor(
        @InjectContractProvider()
        private readonly contract: EthersContract,
      ) {}
      @Get()
      async get() {
        const contract = this.contract.create(
            '0x5fbdb2315678afecb367f032d93f642f64180aa3',
            abi,
          ) as Lock
    
        return { gasPrice: await contract.owner() }
      }
}
