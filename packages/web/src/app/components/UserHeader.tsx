import React from "react"

import { useSelector } from "react-redux"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"
import LoginButton from "./LoginButton"
import SugarCubeIcon from "./SugarCubeIcon"
import UserDetails from "./UserDetails"

const UserHeader = () => {
  const { authStatus } = useSelector((state: State) => state.auth)

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <div className="normal-case text-xl">
          <SugarCubeIcon classes="w-5 h-5 span " /> Minechain
        </div>
      </div>
      <div className="flex-0">
        {authStatus === AuthStatus.LoggedIn ? <UserDetails /> : <LoginButton />}
      </div>
    </div>
  )
}

export default UserHeader
