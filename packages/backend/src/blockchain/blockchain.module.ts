import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EthersModule } from 'nestjs-ethers';
import { BlockchainController } from './blockchain.controller';
import { BlockchainProvider } from './blockchain.provider';
import { BlockchainService } from './blockchain.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        network: { name: 'localhost', chainId: 31337 },
        custom: 'http://127.0.0.1:8545/',
        waitUntilIsConnected: true,
        useDefaultProvider: false,
      }),
    }),
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService, BlockchainProvider],
})
export class BlockchainModule {}
