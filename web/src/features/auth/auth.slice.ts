import { createSlice } from "@reduxjs/toolkit"

import { initialize, login, logout } from "./auth.actions"

export interface AuthState {
  isLoggedIn: boolean
  user: {
    id: number
    publicAddress: string
    isSuperUser: boolean
    dateJoined: string
  } | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [initialize.fulfilled.type]: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload.user
    },
    [login.fulfilled.type]: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload.user
    },
    [logout.fulfilled.type]: (state) => {
      state.isLoggedIn = false
      state.user = null
    }
  }
})

const { reducer } = authSlice
export default reducer
