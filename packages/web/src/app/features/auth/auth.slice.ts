import { createSlice } from "@reduxjs/toolkit"

import { initialize, login, logout } from "./auth.actions"
import { AuthStatus } from "./auth.types"

export interface AuthState {
  authStatus: AuthStatus
  user: {
    id: number
    publicAddress: string
    isSuperUser: boolean
    dateJoined: string
  } | null
}

const initialState: AuthState = {
  authStatus: AuthStatus.Pending,
  user: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [initialize.fulfilled.type]: (state, action) => {
      state.authStatus = AuthStatus.LoggedIn
      state.user = action.payload.user
    },
    [initialize.rejected.type]: (state) => {
      state.authStatus = AuthStatus.AnonymousUser
    },
    [login.fulfilled.type]: (state, action) => {
      state.authStatus = AuthStatus.LoggedIn
      state.user = action.payload.user
    },
    [logout.fulfilled.type]: (state) => {
      state.authStatus = AuthStatus.AnonymousUser
      state.user = null
    },
    [logout.rejected.type]: (state) => {
      state.authStatus = AuthStatus.AnonymousUser
      state.user = null
    }
  }
})

const { reducer } = authSlice
export default reducer
