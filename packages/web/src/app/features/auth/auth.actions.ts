import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { ethers } from "ethers"

export const initialize = createAsyncThunk("auth/initalize", async () => {
  const response = await axios.get("api/v1/users/whoami")
  return { user: response.data }
})

export const login = createAsyncThunk("auth/login", async () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  )
  const connectedAccounts = await provider.send("eth_requestAccounts", [])

  const res = await axios.post("api/v1/auth/signin", {
    publicAddress: connectedAccounts[0]
  })

  const nonce = res.data
  const sign = provider.getSigner(connectedAccounts[0])
  const signature = await sign.signMessage(nonce)

  const res2 = await axios.post("api/v1/auth/verify", {
    publicAddress: connectedAccounts[0],
    signedNonce: signature
  })

  return { user: res2.data }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  const res = await axios.post("api/v1/auth/logout")
  return res.data
})
