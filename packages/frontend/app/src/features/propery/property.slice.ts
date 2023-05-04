import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PriceChangedAction, RepossessedAction, SoldAction, Token } from './types'

export interface propertyState {
  properties: Record<number, Token> | null
  initialized: boolean
}

const initialState: propertyState = {
  properties: null,
  initialized: false,
}

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    sold: (state, payload: PayloadAction<SoldAction>) => {
      const transaction = payload.payload
      if (state.initialized && state.properties) {
        const property = state.properties[transaction.tokenId]
        property.price = transaction.price
        property.owner = transaction.to
      }
    },
    repossessed: (state, payload: PayloadAction<RepossessedAction>) => {
      const transaction = payload.payload
      if (state.initialized && state.properties) {
        const property = state.properties[transaction.tokenId]
        property.price = '0'
        property.owner = transaction.to
      }
    },
    priceChanged: (state, payload: PayloadAction<PriceChangedAction>) => {
      const transaction = payload.payload
      if (state.initialized && state.properties) {
        const property = state.properties[transaction.tokenId]
        property.price = transaction.newPrice
      }
    },
  },
})

export const propertyActions = propertySlice.actions
const { reducer } = propertySlice
export default reducer
