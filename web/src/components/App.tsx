import React from "react"

import { Route, Routes } from "react-router-dom"

import Test from "./Test"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/foo" element={<div>Foo</div>} />
    </Routes>
  )
}

export default App
