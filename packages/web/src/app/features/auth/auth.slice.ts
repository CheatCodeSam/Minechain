import { createSlice } from "@reduxjs/toolkit"

import { getAuth, login, logout } from "./auth.actions"
import { AuthStatus } from "./auth.types"

export interface AuthState {
  authStatus: AuthStatus
  loginRedirect: string
  user: {
    id: number
    publicAddress: string
    isSuperUser: boolean
    dateJoined: string
  } | null
}

const initialState: AuthState = {
  authStatus: AuthStatus.Pending,
  loginRedirect: "/",
  user: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginRedirect(state, action) {
      state.loginRedirect = action.payload
    }
  },
  extraReducers: {
    [getAuth.fulfilled.type]: (state, action) => {
      state.authStatus = AuthStatus.LoggedIn
      state.user = action.payload.user
    },
    [getAuth.rejected.type]: (state) => {
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

export const { setLoginRedirect } = authSlice.actions
const { reducer } = authSlice
export default reducer
