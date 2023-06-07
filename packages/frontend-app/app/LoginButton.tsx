'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { ethers } from 'ethers'

export default function SignInButton() {
  const { data: session } = useSession()

  const handleLogin = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const connectedAccounts = await provider.send('eth_requestAccounts', [])
    const publicAddress = connectedAccounts[0]

    const res = await axios.post('http://localhost:3333/api/auth/signin', {
      publicAddress,
    })

    const nonce = res.data.nonce
    const sign = provider.getSigner(publicAddress)
    const signature = await sign.signMessage(nonce)

    signIn('credentials', {
      signature,
      publicAddress,
      redirect: false,
    })
  }
  if (!session) return <button onClick={() => handleLogin()}>Sign in</button>
  else
    return (
      <div className="" onClick={() => signOut()}>
        {session.user!.name}
      </div>
    )
}
