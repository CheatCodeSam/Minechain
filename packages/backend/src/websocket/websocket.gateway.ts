import { Server } from 'socket.io'

import { Injectable } from '@nestjs/common'
import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets'

@WSGateway({
  namespace: '/api/v1/ws',
  path: '/api/v1/ws/socket.io',
})
@Injectable()
export class WebSocketGateway {
  @WebSocketServer()
  server: Server

  async emit(namespace: string, event: string, body: any) {
    this.server.of(`/${namespace}`).emit(event, body)
  }
}
