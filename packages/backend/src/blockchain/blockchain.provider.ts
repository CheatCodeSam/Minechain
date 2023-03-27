import { abi , Lock} from '@minechain/eth-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';
import { BlockchainService } from './blockchain.service';

@Injectable()
export class BlockchainProvider {
  constructor(
    @InjectContractProvider()
    private readonly ethersContract: EthersContract,
    @InjectEthersProvider()
    private readonly rpcProvider: ethers.providers.StaticJsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly blockchainService: BlockchainService
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    const contract = this.ethersContract.create( contractAddress , abi) as Lock;

    this.rpcProvider.once("block", () => {
      contract.on(contract.filters.Withdrawal(), this.withdrawl)
    })
  }

  withdrawl() {
    this.blockchainService.helloWorld()
  }
}
