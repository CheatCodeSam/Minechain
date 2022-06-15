import React, { useState } from "react"

import axios from "axios"
import { ethers } from "ethers"

const App = () => {
  const [connectedAccount, setConnectedAccount] = useState()

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ethers.providers.ExternalProvider
    )
    const connectedAccounts = await provider.send("eth_requestAccounts", [])
    setConnectedAccount(connectedAccounts[0])

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

    window.sessionStorage.setItem("accessToken", res2.data.accessToken)
    console.log(window.sessionStorage.getItem("accessToken"))
  }

  return (
    <div>
      <button className="btn btn-primary gap-2 m-2" onClick={connectWallet}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 32 32">
          <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z" />
        </svg>
        Login with MetaMask
      </button>
    </div>
  )
}

export default App
