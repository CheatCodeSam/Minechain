import React from "react"

import { useDispatch, useSelector } from "react-redux"

import { login, whoAmI } from "../features/auth/authSlice"
import { AppDispatch, State } from "../store"

const Test = () => {
  const id = useSelector((state: State) => state.auth.id)
  const loggedIn = useSelector((state: State) => state.auth.isLoggedIn)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="gap-2 flex m-2">
      <button className="btn btn-primary gap-2" onClick={() => dispatch(login())}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 32 32">
          <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z" />
        </svg>
        Login with MetaMask
      </button>
      <button onClick={() => dispatch(whoAmI())} className="btn">
        {id}
      </button>
      <p>{loggedIn ? "You are logged in" : "You are not logged in"}</p>
    </div>
  )
}

export default Test
