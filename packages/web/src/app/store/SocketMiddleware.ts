import { Middleware } from "@reduxjs/toolkit"
import { io } from "socket.io-client"

const socketMiddleware: Middleware = (store) => {
  // TODO update url behind reverse proxy
  const socket = io("http://localhost:3001", { path: "/api/v1/" })
  socket.on("g", (x) => console.log(x))

  return (next) => (action) => {
    next(action)
  }
}

export default socketMiddleware
