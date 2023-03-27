import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/auth.slice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
})

export type Store = typeof store
export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
