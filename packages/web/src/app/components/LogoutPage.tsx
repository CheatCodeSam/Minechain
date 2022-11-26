import { useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import { logout } from "../features/auth/auth.actions"
import { AuthStatus } from "../features/auth/auth.types"
import { AppDispatch, State } from "../store"

const LogoutPage = () => {
  const { authStatus } = useSelector((state: State) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (authStatus === AuthStatus.LoggedIn) dispatch(logout())
  }, [authStatus, dispatch])

  if (authStatus === AuthStatus.AnonymousUser) return <Navigate to="/" />
  else return <div>Waiting</div>
}

export default LogoutPage
