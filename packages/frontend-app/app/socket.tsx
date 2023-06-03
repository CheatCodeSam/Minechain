'use client'
import { io } from 'socket.io-client'

import { useEffect } from 'react'

export default function Socket() {
  useEffect(() => {
    const socket = io('http://localhost:3333/api/v1/ws', {
      path: '/api/v1/ws/socket.io',
      transports: ['websocket'],
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('connect')
    })

    socket.on('sold', (payload) => {
      console.log('buy', payload)
    })
  })
  return <div className="">Hello World</div>
}
