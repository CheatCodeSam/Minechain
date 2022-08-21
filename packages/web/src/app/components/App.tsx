import React, { useEffect } from "react"

import { Toaster } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { getAuth } from "../features/auth/auth.actions"
import { AppDispatch } from "../store"
import Account from "./Account"
import LoginPage from "./LoginPage"
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
      <Toaster />
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register/:jwt" element={<Registration />} />
        <Route path="/" element={<Test />}>
          <Route path="account" element={<Account />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<p>Theres nothing here!</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
