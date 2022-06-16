import { createSlice } from "@reduxjs/toolkit"

import { initialize, login, logout } from "./auth.actions"

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: {
    [initialize.fulfilled.type]: (state) => {
      state.isLoggedIn = true
    },
    [login.fulfilled.type]: (state) => {
      state.isLoggedIn = true
    },
    [logout.fulfilled.type]: (state) => {
      state.isLoggedIn = false
    }
  }
})

const { reducer } = authSlice
export default reducer
