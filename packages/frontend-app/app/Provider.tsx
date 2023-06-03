'use client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'

interface PropTypes {
  children: React.ReactNode
}

export default function Provider(props: PropTypes) {
  return <ReduxProvider store={store}>{props.children}</ReduxProvider>
}
