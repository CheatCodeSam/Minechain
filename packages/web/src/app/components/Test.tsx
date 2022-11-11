import React from "react"

import { Outlet } from "react-router-dom"

import TableView from "./TableView"
import UserHeader from "./UserHeader"

const Test = () => {
  return (
    <div className="">
      <UserHeader />
      <main className="m-2">
        <Outlet />
      </main>
      <div className="">
        <TableView />
      </div>
    </div>
  )
}

export default Test
