import { createAsyncThunk, isAnyOf, isFulfilled, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'
import { ethers } from 'ethers'

export const whoAmI = createAsyncThunk('auth/whoami', async () => {
  const response = await axios.get('api/user')
  return { user: response.data }
})

export const login = createAsyncThunk('auth/login', async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const connectedAccounts = await provider.send('eth_requestAccounts', [])

  const nonceResponse = await axios.post('api/auth/signin', {
    publicAddress: connectedAccounts[0],
  })

  const nonce = nonceResponse.data.nonce
  const signer = provider.getSigner(connectedAccounts[0])
  const signature = await signer.signMessage(nonce)

  const verifyResponse = await axios.post('api/auth/verify', {
    publicAddress: connectedAccounts[0],
    signedNonce: signature,
  })

  return { user: verifyResponse.data }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  axios.post('api/auth/logout')
})

export const registerMojang = createAsyncThunk(
  'auth/registerMojang',
  async (token: string) => {
    const response = await axios.post('api/v1/registration', { token })
    return { user: response.status }
  }
)


export const isARejectedAuthentication = isAnyOf(isRejected(whoAmI, login, logout), logout.fulfilled)
export const isAFulfilledAuthentication = isFulfilled(login, whoAmI)