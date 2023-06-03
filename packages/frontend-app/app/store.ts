import { configureStore } from '@reduxjs/toolkit'
import socketMiddleware from './socketMiddleware'

export const store = configureStore({
  middleware: (gDM) => gDM().concat(socketMiddleware),
  reducer: {
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
