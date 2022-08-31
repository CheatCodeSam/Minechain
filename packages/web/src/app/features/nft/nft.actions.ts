import { Minechain, minechainJson } from "@./abi-typings"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ethers } from "ethers"

import { State } from "../../store"

export const safeMint = createAsyncThunk("nft/safeMint", async (tokenId: number, thunkAPI) => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as unknown as ethers.providers.ExternalProvider
  )
  const signer = provider.getSigner()
  const address = await signer.getAddress()

  const state = thunkAPI.getState() as State
  const loggedInAddress = state.auth.user?.publicAddress

  if (!loggedInAddress || loggedInAddress.toLowerCase() !== address.toLowerCase())
    throw new Error("logged in address isnt the same as signer.")

  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    minechainJson,
    signer
  ) as Minechain
  const tx = await contract.safeMint(address, tokenId, { value: ethers.utils.parseEther("0.01") })
  await tx.wait()
  console.log(await contract.ownerOf(tokenId))
  console.log((await contract.balanceOf(address)).toNumber())
  return "scuccess"
})
