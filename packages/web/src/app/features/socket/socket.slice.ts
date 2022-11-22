import { createSlice } from "@reduxjs/toolkit"

export interface SocketState {
  isEstablishingConnection: boolean
  isConnected: boolean
  playerLocations: Record<string, any>
}
const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
  playerLocations: {}
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
      console.log(payload)
    },
    playerMove: (state, payload) => {
      state.playerLocations[payload.payload.uuid] = payload.payload
    },
    playerLeave: (state, payload) => {
      delete state.playerLocations[payload.payload.uuid]
    }
  }
})
export const socketActions = socketSlice.actions
const { reducer } = socketSlice
export default reducer
