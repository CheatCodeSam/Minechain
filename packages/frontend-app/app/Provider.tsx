'use client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { SessionProvider } from 'next-auth/react'

interface PropTypes {
  children: React.ReactNode
}

export default function Provider(props: PropTypes) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>{props.children}</SessionProvider>
    </ReduxProvider>
  )
}
