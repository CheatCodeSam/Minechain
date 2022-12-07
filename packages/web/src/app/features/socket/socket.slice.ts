import { createSlice } from "@reduxjs/toolkit"

export interface SocketState {
  isEstablishingConnection: boolean
  isConnected: boolean
  playerLocations: Record<string, any>
  playerLocationsIds: Array<number>
}
const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
  playerLocations: {},
  playerLocationsIds: []
}
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true
    },
    connectionEstablished: (state) => {
      state.isConnected = true
      state.isEstablishingConnection = true
    },
    playerJoin: (state, payload) => {
      state.playerLocations[payload.payload.id] = payload.payload
      state.playerLocationsIds.push(payload.payload.id)
    },
    playerMove: (state, payload) => {
      state.playerLocations[payload.payload.id] = payload.payload
    },
    playerLeave: (state, payload) => {
      delete state.playerLocations[payload.payload.id]
      state.playerLocationsIds = state.playerLocationsIds.filter((e) => e !== payload.payload.id)
    }
  }
})
export const socketActions = socketSlice.actions
const { reducer } = socketSlice
export default reducer
