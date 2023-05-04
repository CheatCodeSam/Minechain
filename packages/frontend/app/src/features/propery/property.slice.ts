import { createSlice } from '@reduxjs/toolkit'
import { Token } from '../../types/Token'
import { ethers } from 'ethers'
import { Minechain, abi } from '@minechain/eth-types'

export interface propertyState {
  properties: Record<number, Token> | null
  initialized: boolean
}

const initialState = {
  properties: null,
  initialized: false,
}

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    sold: (state, payload) => {
      console.log(payload.payload)
    },
    repossessed: (state, payload) => {},
    priceChanged: (state, payload) => {},
  },
})

export const propertyActions = propertySlice.actions
const { reducer } = propertySlice
export default reducer
