import React from "react"

import { useDispatch } from "react-redux"

import { login } from "../features/auth/auth.actions"
import { AppDispatch } from "../store"

const LoginButton = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <button className="btn btn-primary gap-2" onClick={() => dispatch(login())}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 32 32">
        <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z" />
      </svg>
      Login with MetaMask
    </button>
  )
}

export default LoginButton
