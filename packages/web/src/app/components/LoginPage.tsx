import React from "react"

import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"
import LoginButton from "./LoginButton"

const LoginPage = () => {
  const { authStatus, loginRedirect } = useSelector((state: State) => state.auth)

  if (authStatus === AuthStatus.LoggedIn) {
    return <Navigate to={loginRedirect}></Navigate>
  } else {
    return (
      <div>
        Dedicated Login Page
        <LoginButton />
      </div>
    )
  }
}

export default LoginPage
