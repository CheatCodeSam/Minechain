import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import Test from "./Test"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />}>
          <Route path="account" element={<div>Account</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
        <Route path="*" element={<p>Theres nothing here!</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
