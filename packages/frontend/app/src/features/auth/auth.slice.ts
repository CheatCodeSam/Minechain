import { createSlice } from '@reduxjs/toolkit'

import { isARejectedAuthentication, isAFulfilledAuthentication, logout } from './auth.actions'

export interface AuthState {
  authStatus: 'PENDING' | 'LOGGEDIN' | 'ANONYMOUSUSER'
  user: {
    id: number
    isActive: boolean
    publicAddress: string
    mojangId: string | null
    lastKnownRegion: number | null
    dateJoined: string
    lastLogin: string | null
    isSuperUser: boolean
    display: string
  } | null
}

const initialState: AuthState = {
  authStatus: 'PENDING',
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.authStatus = 'PENDING'
      })
      .addMatcher(isAFulfilledAuthentication, (state, action) => {
        state.authStatus = 'LOGGEDIN'
        state.user = action.payload.user
      })
      .addMatcher(isARejectedAuthentication, (state) => {
        state.authStatus = 'ANONYMOUSUSER'
        state.user = null
      })
  }
})

const { reducer } = authSlice
export default reducer
