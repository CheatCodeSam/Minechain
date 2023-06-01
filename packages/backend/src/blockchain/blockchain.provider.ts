import { abi, Minechain } from '@minechain/eth-types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BigNumber as bn, ethers } from 'ethers'
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from './nestjs-ethers'

import { Subject } from 'rxjs'
import {
  PriceChangedEvent,
  RepossessedEvent,
  SoldEvent,
  DepositEvent,
  WithdrawalEvent,
} from './blockchain.events'

@Injectable()
export class BlockchainProvider {
  private soldSubject = new Subject<SoldEvent>()
  private repossessedSubject = new Subject<RepossessedEvent>()
  private priceChangedSubject = new Subject<PriceChangedEvent>()
  private withdrawalSubject = new Subject<WithdrawalEvent>()
  private depositSubject = new Subject<DepositEvent>()

  public sold$ = this.soldSubject.asObservable()
  public repossessed$ = this.repossessedSubject.asObservable()
  public priceChanged$ = this.priceChangedSubject.asObservable()
  public withdrawal$ = this.withdrawalSubject.asObservable()
  public deposit$ = this.depositSubject.asObservable()

  constructor(
    @InjectContractProvider('lcl')
    private readonly ethersContract: EthersContract,
    @InjectEthersProvider('lcl')
    private readonly rpcProvider: ethers.providers.StaticJsonRpcProvider,
    private readonly configService: ConfigService
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    const contract = this.ethersContract.create(
      contractAddress,
      abi
    ) as Minechain

    this.rpcProvider.once('block', () => {
      contract.on(
        contract.filters.Sold(),
        (from: string, to: string, tokenId: bn, price: bn) =>
          this.soldSubject.next({ from, to, tokenId, price })
      )
      contract.on(
        contract.filters.Repossessed(),
        (from: string, to: string, tokenId: bn) =>
          this.repossessedSubject.next({ from, to, tokenId })
      )
      contract.on(
        contract.filters.PriceChanged(),
        (owner: string, tokenId: bn, oldPrice: bn, newPrice: bn) =>
          this.priceChangedSubject.next({ owner, tokenId, oldPrice, newPrice })
      )
      contract.on(
        contract.filters.Deposit(),
        (from: string, tokenId: bn, newAmount: bn, amountAdded: bn) =>
          this.depositSubject.next({ from, tokenId, newAmount, amountAdded })
      )
      contract.on(
        contract.filters.Withdrawal(),
        (to: string, tokenId: bn, newAmount: bn, amountWithdrawn: bn) =>
          this.withdrawalSubject.next({ to, tokenId, newAmount, amountWithdrawn })
      )
    })
  }

  onModuleDestroy() {
    this.soldSubject.complete()
    this.repossessedSubject.complete()
    this.priceChangedSubject.complete()
  }
}
