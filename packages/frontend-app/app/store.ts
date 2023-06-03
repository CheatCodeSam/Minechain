import { configureStore } from '@reduxjs/toolkit'
import socketMiddleware from './socketMiddleware'

import propertyReducer from "./propertySlice"
import socketReducer from "./socketSlice"

export const store = configureStore({
  middleware: (gDM) => gDM().concat(socketMiddleware),
  reducer: {
    socket: socketReducer,
    property: propertyReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
