import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/auth/auth.slice"
import nftReducer from "../features/nft/nft.slice"
import socketMiddleware from "./SocketMiddleware"

export const store = configureStore({
  middleware: (gDM) => gDM().concat(socketMiddleware),
  reducer: {
    auth: authReducer,
    nft: nftReducer
  }
})

export type Store = typeof store
export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
