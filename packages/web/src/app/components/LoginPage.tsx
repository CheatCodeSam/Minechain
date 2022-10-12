import React from "react"

import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"
import LoginButton from "./LoginButton"
import SugarCubeIcon from "./SugarCubeIcon"

const LoginPage = () => {
  const { authStatus } = useSelector((state: State) => state.auth)
  const state = useLocation().state as { redirect?: string }

  if (authStatus === AuthStatus.LoggedIn) {
    return <Navigate to={state?.redirect || "/"} />
  } else {
    return (
      <div className="grid h-screen place-items-center">
        <div className="card w-96 bg-green-400 shadow-xl">
          <div className="card-body">
            <div className="card-actions justify-center">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
