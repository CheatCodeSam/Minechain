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
    contract.on(contract.filters.Sold(), (...args) =>
      store.dispatch(propertyActions.sold({...args}))
    )
    contract.on(contract.filters.Repossessed(), (...args) =>
      store.dispatch(propertyActions.repossessed({...args}))
    )
    contract.on(contract.filters.PriceChanged(), (...args) =>
      store.dispatch(propertyActions.priceChanged({...args}))
    )
  })

  return (next) => (action) => next(action)
}
