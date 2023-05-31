'use client'

import { Minechain, abi } from '@minechain/eth-types'
import { ethers } from 'ethers'

interface PropTypes {
  id: number
}

export default function BuyButton(props: PropTypes) {
  const buyProperty = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      abi,
      signer
    ) as Minechain
    const tx = await contract.buy(props.id, 10000, { value: 200000 })
    await tx.wait()
  }

  return <button onClick={() => buyProperty()}>Buy</button>
}
