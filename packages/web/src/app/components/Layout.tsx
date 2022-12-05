import React from "react"

import { Outlet } from "react-router-dom"

import UserHeader from "./UserHeader"

const Layout = () => {
  return (
    <div className="">
      <UserHeader />
      <main className="m-2">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
