import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import Account from "./Account"
import Settings from "./Settings"
import Test from "./Test"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
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
