import React, { useState } from "react"

import { ethers } from "ethers"
import { Route, Routes } from "react-router-dom"

import JwtAxios from "../JwtAxios"
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
