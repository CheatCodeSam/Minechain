import { Injectable } from '@nestjs/common'
import { EthersContract, InjectContractProvider } from './nestjs-ethers'
import { Minechain, abi } from '@minechain/eth-types'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BlockchainService {
  private readonly contract: Minechain

  constructor(
    @InjectContractProvider('lcl')
    private readonly ethersContract: EthersContract,
    private readonly configService: ConfigService
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    this.contract = this.ethersContract.create(
      contractAddress,
      abi
    ) as Minechain
  }

  public async findOne(tokenId: number) {
    return this.contract.tokens(tokenId)
  }
}
