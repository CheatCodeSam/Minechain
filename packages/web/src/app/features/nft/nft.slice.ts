import { createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import { safeMint } from "./nft.actions"

export const nftSlice = createSlice({
  name: "nft",
  initialState: {},
  reducers: {},
  extraReducers: {
    [safeMint.fulfilled.type]: (state, action) => {
      toast.success("Transaction successful!")
      console.log(action)
    },
    [safeMint.rejected.type]: (state, action) => {
      toast.error("There was an error with the transaction")
    }
  }
})

const { reducer } = nftSlice
export default reducer
