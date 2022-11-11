import { Middleware } from "@reduxjs/toolkit"
import { io } from "socket.io-client"

const socketMiddleware: Middleware = (store) => {
  const socket = io()

  return (next) => (action) => {
    next(action)
  }
}

export default socketMiddleware
