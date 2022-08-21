import React from "react"

import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"
import LoginButton from "./LoginButton"

const LoginPage = () => {
  const { authStatus } = useSelector((state: State) => state.auth)
  const state = useLocation().state as { redirect?: string }

  if (authStatus === AuthStatus.LoggedIn) {
    return <Navigate to={state?.redirect || "/"} />
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
