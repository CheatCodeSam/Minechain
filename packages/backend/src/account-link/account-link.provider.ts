import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import { AccountLinkService } from './account-link.service'
import { MojangIdDto } from './dto/mojang-id-dto'

@Injectable()
export class AccountLinkProvider {
  constructor(private readonly accountLinkService: AccountLinkService) {}

  @RabbitRPC({
    exchange: 'account-link',
    routingKey: 'generateRegistrationToken',
    queueOptions: { autoDelete: true },
  })
  public async generateRegistrationToken({ uuid }: MojangIdDto) {
    return this.accountLinkService.generateRegistrationToken(uuid)
  }

  @RabbitRPC({
    exchange: 'account-link',
    routingKey: 'isLinked',
    queueOptions: { autoDelete: true },
  })
  public async isLinked({ uuid }: MojangIdDto) {
    return await this.accountLinkService.isLinked(uuid)
  }
}
