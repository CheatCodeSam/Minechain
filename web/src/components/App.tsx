import React, { useEffect } from "react"

import { useDispatch } from "react-redux"
import { Route, Routes } from "react-router-dom"

import { whoAmI } from "../features/auth/authSlice"
import { AppDispatch } from "../store"
import Test from "./Test"

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(whoAmI())
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/foo" element={<div>Foo</div>} />
    </Routes>
  )
}

export default App
