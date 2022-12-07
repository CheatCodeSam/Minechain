import { createSlice } from "@reduxjs/toolkit"

import { initialize } from "./property.actions"

export interface PropertyState {
  isInitialized: boolean
  propertiesOwned: Record<string, { id: number; tokenId: number; userId: number; user: any }>
  propertiesOwnedIds: number[]
  selectedProperty: number | null
}
const initialState: PropertyState = {
  isInitialized: false,
  propertiesOwned: {},
  propertiesOwnedIds: [],
  selectedProperty: null
}

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    allocate: (state, payload) => {
      if (state.isInitialized) {
        state.propertiesOwned[payload.payload.tokenId] = payload.payload
        state.propertiesOwnedIds.push(parseInt(payload.payload.tokenId))
      }
    },
    selectProperty: (state, payload) => {
      state.selectedProperty = payload.payload
    }
  },
  extraReducers: {
    [initialize.fulfilled.type]: (state, action) => {
      state.isInitialized = true
      action.payload.properties.forEach((prop: any) => {
        state.propertiesOwned[prop.tokenId] = prop
        state.propertiesOwnedIds.push(prop.tokenId)
      })
    },
    [initialize.rejected.type]: (state, action) => {
      console.log(action)
    }
  }
})

export const propertyActions = propertySlice.actions
const { reducer } = propertySlice
export default reducer
