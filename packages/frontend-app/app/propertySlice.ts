import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { property } from './types'



interface SoldAction {
  from: string
  to: string
  tokenId: number
  price: string
  property: property
}

export interface PropertyState {
  properties: Record<number, property>
}
const initialState: PropertyState = {
  properties: {},
}

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    sold: (state, payload: PayloadAction<SoldAction>) => {
      const transaction = payload.payload
      const { property, tokenId } = transaction
      state.properties[tokenId] = property
    },
  },
})

export const propertyActions = propertySlice.actions
const { reducer } = propertySlice
export default reducer
