import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { login, whoAmI } from '../features/auth/auth.actions'
import { AppDispatch } from './store'
import { ethers } from 'ethers'
import { Minechain, abi } from '@minechain/eth-types'


const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  

  useEffect(() => {
    dispatch(whoAmI())

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract("0x5fbdb2315678afecb367f032d93f642f64180aa3", abi, provider) as Minechain
    contract.tokens(0).then(t => console.log(t))
  })

  return (
    <div className="" onClick={() => dispatch(login())}>Login</div>
  )
}

export default App
