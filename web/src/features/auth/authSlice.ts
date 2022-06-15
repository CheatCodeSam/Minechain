import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ethers } from "ethers"

import JwtAxios from "../../JwtAxios"

export const whoAmI = createAsyncThunk("auth/whoAmI", async () => {
  const res = await JwtAxios.get("api/v1/users/whoami")
  return res.data
})

export const login = createAsyncThunk("auth/login", async () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  )
  const connectedAccounts = await provider.send("eth_requestAccounts", [])

  const res = await JwtAxios.post("api/v1/auth/signin", {
    publicAddress: connectedAccounts[0]
  })

  const nonce = res.data
  const sign = provider.getSigner(connectedAccounts[0])
  const signature = await sign.signMessage(nonce)

  const res2 = await JwtAxios.post("api/v1/auth/verify", {
    publicAddress: connectedAccounts[0],
    signedNonce: signature
  })

  window.sessionStorage.setItem("accessToken", res2.data.accessToken)
})

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    id: 0
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
    }
  },
  extraReducers: {
    [whoAmI.fulfilled.type]: (state, action) => {
      state.isLoggedIn = true
      state.id = action.payload.id
    },
    [login.fulfilled.type]: (state) => {
      state.isLoggedIn = true
    }
  }
})

const { reducer, actions } = authSlice
export const { logout } = actions
export default reducer
