import { Observable, from } from "rxjs"
import { map } from "rxjs/operators"
import { Server } from "socket.io"

import { Injectable } from "@nestjs/common"
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from "@nestjs/websockets"

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  path: "/api/v1/"
})
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server

  async emit(ev: string, body: any) {
    this.server.emit(ev, body)
  }
}
