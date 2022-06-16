import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
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

export const logout = createAsyncThunk("auth/logout", async () => {
  const res = await axios
    .post("api/v1/auth/logout")
    .finally(() => window.sessionStorage.removeItem("accessToken"))
  return res.data
})

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: true,
    id: -1
  },
  reducers: {},
  extraReducers: {
    [whoAmI.fulfilled.type]: (state, action) => {
      state.isLoggedIn = true
      state.id = action.payload.id
    },
    [login.fulfilled.type]: (state) => {
      state.isLoggedIn = true
    },
    [login.rejected.type]: (state) => {
      state.isLoggedIn = false
    },
    [logout.fulfilled.type]: (state) => {
      state.isLoggedIn = false
      state.id = -1
    }
  }
})

const { reducer } = authSlice
export default reducer
