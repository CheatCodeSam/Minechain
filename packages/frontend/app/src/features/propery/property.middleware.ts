import { Minechain, abi } from '@minechain/eth-types'
import { Middleware } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { propertyActions } from './property.slice'

export const propertyMiddlware: Middleware = (store) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(
    __CONTRACT_ADDRESS__,
    abi,
    provider
  ) as Minechain

  provider.once('block', () => {
    contract.on(contract.filters.Sold(), (from, to, tokenId, price, _) =>
      store.dispatch(
        propertyActions.sold({
          from,
          to,
          tokenId: tokenId.toNumber(),
          price: price.toString(),
        })
      )
    )
    contract.on(contract.filters.Repossessed(), (from, to, tokenId, _) =>
      store.dispatch(
        propertyActions.repossessed({ from, to, tokenId: tokenId.toNumber() })
      )
    )
    contract.on(
      contract.filters.PriceChanged(),
      (owner, tokenId, oldPrice, newPrice, _) =>
        store.dispatch(
          propertyActions.priceChanged({
            owner,
            tokenId: tokenId.toNumber(),
            oldPrice: oldPrice.toString(),
            newPrice: newPrice.toString(),
          })
        )
    )
  })

  return (next) => (action) => next(action)
}
