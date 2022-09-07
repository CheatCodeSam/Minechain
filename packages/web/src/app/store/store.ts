import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/auth/auth.slice"
import nftReducer from "../features/nft/nft.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nft: nftReducer
  }
})

export type Store = typeof store
export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
