import React from "react"

import { useSelector } from "react-redux"

import { State } from "../store"
import LoginButton from "./LoginButton"
import UserDetails from "./UserDetails"

const UserHeader = () => {
  const { isLoggedIn } = useSelector((state: State) => state.auth)

  if (isLoggedIn) return <UserDetails />
  else {
    return <LoginButton />
  }
}

export default UserHeader
