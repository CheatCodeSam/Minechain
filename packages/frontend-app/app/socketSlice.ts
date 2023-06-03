import { createSlice } from '@reduxjs/toolkit'

export interface SocketState {
  isConnected: boolean
}
const initialState: SocketState = {
  isConnected: false,
}
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {},
})

export const socketActions = socketSlice.actions
const { reducer } = socketSlice
export default reducer
