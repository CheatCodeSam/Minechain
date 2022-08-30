import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { ethers } from "ethers"

import Minechain from "./Minechain.json"

export const getAuth = createAsyncThunk("auth/getAuth", async () => {
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

export const registerMojang = createAsyncThunk("auth/registerMojang", async (token: string) => {
  const response = await axios.post("api/v1/registration", { token })
  return { user: response.status }
})

// @ts-ignore
window.buyNft = async () => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  )
  // get the end user
  const signer = provider.getSigner()
  const address = await signer.getAddress()

  // get the smart contract
  const contract = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    Minechain.abi,
    signer
  )
  await contract["safeMint"](address, 0, { value: ethers.utils.parseEther("0.01") })
}
