import { Middleware } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { propertyActions } from './propertySlice'

const socketMiddleware: Middleware = (store) => {
  const socket = io('http://localhost:3333/api/v1/ws', {
    path: '/api/v1/ws/socket.io',
    transports: ['websocket'],
    withCredentials: true,
  })

  socket.on('connect', () => {
    console.log('connect')
  })

  socket.on('sold', (payload) => {
    store.dispatch(propertyActions.sold(payload))
  })

  return (next) => (action) => next(action)
}

export default socketMiddleware
