import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { whoAmI } from '../features/auth/auth.actions'
import { AppDispatch } from './store'


const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(whoAmI())
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hello" element={<p>Hello World!</p>} />
        <Route path="*" element={<p>Theres nothing here!</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
