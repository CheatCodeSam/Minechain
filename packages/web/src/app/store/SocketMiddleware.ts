import { Middleware } from "@reduxjs/toolkit"
import { Socket, io } from "socket.io-client"

import { socketActions } from "../features/socket/socket.slice"

const socketMiddleware: Middleware = (store) => {
  // TODO update url behind reverse proxy
  let socket: Socket

  return (next) => (action) => {
    if (!socketActions.startConnecting.match(action)) {
      return next(action)
    }

    socket = io("http://localhost:4200/api/v1/ws", {
      path: "/api/v1/ws/socket.io",
      transports: ["websocket"],
      withCredentials: true
    })

    socket.on("g", (x) => console.log(x))
    console.log("g")

    socket.on("connect", () => {
      store.dispatch(socketActions.connectionEstablished())
    })

    next(action)
  }
}

export default socketMiddleware
