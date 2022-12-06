import { createSlice } from "@reduxjs/toolkit"

import { initialize } from "./property.actions"

export interface PropertyState {
  isInitialized: boolean
  propertiesOwned: Array<{ id: number; tokenId: number; userId: number }>
}
const initialState: PropertyState = {
  isInitialized: false,
  propertiesOwned: []
}

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    allocate: (state, payload) => {
      console.log(payload)
    }
  },
  extraReducers: {
    [initialize.fulfilled.type]: (state, action) => {
      state.isInitialized = true
      state.propertiesOwned = action.payload.properties
    },
    [initialize.rejected.type]: (state, action) => {
      console.log(action)
    }
  }
})

export const propertyActions = propertySlice.actions
const { reducer } = propertySlice
export default reducer
