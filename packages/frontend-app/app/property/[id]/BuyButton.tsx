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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      abi,
      signer
    ) as Minechain
    const tx = await contract.buy(props.id, 10000, { value: 200000 })
    await tx.wait()
  }
  return <button onClick={() => buyProperty()}>Buy</button>
}
