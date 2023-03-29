import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import { AccountLinkService } from './account-link.service'
import { MojangIdDto } from './dto/mojang-id-dto'

@Injectable()
export class AccountLinkProvider {
  constructor(private readonly accountLinkService: AccountLinkService) {}


  @RabbitRPC({
    exchange: 'minecraft',
    routingKey: 'authenticate',
    queueOptions: { autoDelete: true },
  })
  public async authenticate({ uuid }: MojangIdDto) {
    console.log(uuid)
    return "this.minecraftService.getUser(uuid)"
  }

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
    console.log(uuid);
    
    return this.accountLinkService.isLinked(uuid)
  }
}
