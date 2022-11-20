import { Server } from "socket.io"

import { Injectable } from "@nestjs/common"
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "/api/v1/ws",
  path: "/api/v1/ws/socket.io"
})
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server

  async emit(ev: string, body: any) {
    this.server.emit(ev, body)
  }
}
