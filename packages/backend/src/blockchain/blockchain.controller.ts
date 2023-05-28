import { Controller, Get } from '@nestjs/common'
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from './nestjs-ethers'
import { BigNumber, ethers } from 'ethers'
import { abi, Minechain } from '@minechain/eth-types'
import { BlockchainService } from './blockchain.service'
import { EnsService } from './ens.service'

@Controller('blockchain')
export class BlockchainController {

  constructor(
    @InjectContractProvider("lcl")
    private readonly contract: EthersContract,
    private readonly ensService: EnsService
  ) {}

  @Get()
  async get() {
    const contract = this.contract.create(
      '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      abi
    ) as Minechain

    return { gasPrice: await this.ensService.getEnsName("") }
  }
}
