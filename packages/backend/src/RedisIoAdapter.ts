import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>
  private configService: ConfigService
  private readonly logger = new Logger(RedisIoAdapter.name)

  constructor(appOrHttpServer: any, configService: ConfigService) {
    super(appOrHttpServer)
    this.configService = configService
  }

  async connectToRedis() {
    const pubClient = createClient({ url: this.configService.get('REDIS_URL') })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    this.adapterConstructor = createAdapter(pubClient, subClient)
    if (pubClient.isReady && subClient.isReady)
      this.logger.log('Connected to Redis client.')
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    return server
  }
}
