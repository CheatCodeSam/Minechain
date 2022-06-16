import React from "react"

import { useDispatch, useSelector } from "react-redux"

import { logout } from "../features/auth/auth.actions"
import { AppDispatch, State } from "../store"
import LoginButton from "./LoginButton"

const Test = () => {
  const { isLoggedIn } = useSelector((state: State) => state.auth)
  const { user } = useSelector((state: State) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="gap-2 flex m-2">
      <LoginButton />
      <p>{isLoggedIn ? "You are logged in as " + user?.publicAddress : "You are not logged in"}</p>
      <button onClick={() => dispatch(logout())} className="btn">
        Logout
      </button>
    </div>
  )
}

export default Test
