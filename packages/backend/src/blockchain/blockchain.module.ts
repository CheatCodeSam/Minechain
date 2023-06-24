import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EthersModule, MAINNET_NETWORK } from './nestjs-ethers'
import { BlockchainProvider } from './blockchain.provider'
import { BlockchainService } from './blockchain.service'
import { EnsService } from './ens.service'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      token: 'lcl',
      useFactory: (configService: ConfigService) => ({
        network: { name: 'localhost', chainId: 31337 },
        custom: 'http://127.0.0.1:8545/',
        waitUntilIsConnected: true,
        useDefaultProvider: false,
      }),
    }),
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      token: 'eth',
      useFactory: (configService: ConfigService) => ({
        network: MAINNET_NETWORK,
        alchemy: configService.get('ALCHEMY_API'),
        waitUntilIsConnected: true,
        useDefaultProvider: false,
      }),
    }),
  ],
  controllers: [],
  providers: [BlockchainService, BlockchainProvider, EnsService],
  exports: [EnsService, BlockchainService, BlockchainProvider],
})
export class BlockchainModule {}
