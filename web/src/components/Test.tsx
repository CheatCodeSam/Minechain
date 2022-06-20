import React from "react"

import { Outlet } from "react-router-dom"

import UserHeader from "./UserHeader"

const Test = () => {
  return (
    <div className="gap-2 flex m-2">
      <UserHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Test
