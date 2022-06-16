import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { ethers } from "ethers"

import JwtAxios from "../../JwtAxios"

export const initialize = createAsyncThunk("auth/initalize", async () => {
  const response = await axios.post("api/v1/auth/refresh")
  window.sessionStorage.setItem("accessToken", response.data.accessToken)
  return response.data
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
  return res2.data
})

export const logout = createAsyncThunk("auth/logout", async () => {
  const res = await JwtAxios.post("api/v1/auth/logout").finally(() =>
    window.sessionStorage.removeItem("accessToken")
  )
  return res.data
})
