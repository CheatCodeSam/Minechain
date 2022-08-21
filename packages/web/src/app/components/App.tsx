import React, { useEffect } from "react"

import { useDispatch } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { getAuth } from "../features/auth/auth.actions"
import { AppDispatch } from "../store"
import Account from "./Account"
import Registration from "./Registration"
import Settings from "./Settings"
import Test from "./Test"

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getAuth())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />}>
          <Route path="account" element={<Account />} />
          <Route path="settings" element={<Settings />} />
          <Route path="register/:jwt" element={<Registration />} />
        </Route>
        <Route path="*" element={<p>Theres nothing here!</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
