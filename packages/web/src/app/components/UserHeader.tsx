import React from "react"

import { useSelector } from "react-redux"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"
import LoginButton from "./LoginButton"
import UserDetails from "./UserDetails"

const UserHeader = () => {
  const { authStatus } = useSelector((state: State) => state.auth)

  if (authStatus == AuthStatus.LoggedIn) return <UserDetails />
  else {
    return <LoginButton />
  }
}

export default UserHeader
