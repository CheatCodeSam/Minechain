import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { login, whoAmI } from '../features/auth/auth.actions'
import { AppDispatch } from './store'


const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(whoAmI())
  })

  return (
    <div className="" onClick={() => dispatch(login())}>Login</div>
  )
}

export default App
