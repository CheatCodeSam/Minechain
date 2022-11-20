import { Middleware } from "@reduxjs/toolkit"
import { io } from "socket.io-client"

const socketMiddleware: Middleware = (store) => {
  // TODO update url behind reverse proxy
  const socket = io("http://localhost:4200/api/v1/ws", {
    path: "/api/v1/ws/socket.io",
    transports: ["websocket"]
  })
  socket.on("g", (x) => console.log(x))

  return (next) => (action) => {
    next(action)
  }
}

export default socketMiddleware
