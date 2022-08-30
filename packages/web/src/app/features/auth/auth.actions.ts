import { Minechain, minechainJson } from "@./abi-typings"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { ethers } from "ethers"

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
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    minechainJson,
    signer
  ) as Minechain
  const tx = await contract.safeMint(address, 102, { value: ethers.utils.parseEther("0.01") })
  await tx.wait()
  console.log(await contract.ownerOf(102))
  console.log(await contract.balanceOf(address))
}
