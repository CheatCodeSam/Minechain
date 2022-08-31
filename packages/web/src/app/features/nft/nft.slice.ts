import { createSlice } from "@reduxjs/toolkit"

import { safeMint } from "./nft.actions"

export const nftSlice = createSlice({
  name: "nft",
  initialState: {},
  reducers: {},
  extraReducers: {
    [safeMint.fulfilled.type]: (state, action) => {
      console.log(action)
    }
  }
})

const { reducer } = nftSlice
export default reducer
