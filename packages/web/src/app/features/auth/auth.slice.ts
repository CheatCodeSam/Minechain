import { createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import { getAuth, login, logout, registerMojang } from "./auth.actions"
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
  reducers: {},
  extraReducers: {
    [getAuth.fulfilled.type]: (state, action) => {
      state.authStatus = AuthStatus.LoggedIn
      state.user = action.payload.user
    },
    [getAuth.rejected.type]: (state) => {
      state.authStatus = AuthStatus.AnonymousUser
    },
    [login.fulfilled.type]: (state, action) => {
      toast.success("Successfully logged in.")
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
    },
    [registerMojang.rejected.type]: (state) => {
      toast.error("There was an error registering the user")
    },
    [registerMojang.fulfilled.type]: (state) => {
      toast.success("Successfully registered user")
    }
  }
})

const { reducer } = authSlice
export default reducer
