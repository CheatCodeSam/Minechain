import { useEffect } from "react"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"

const useAuthenticatedRoute = () => {
  const navigate = useNavigate()
  const { authStatus } = useSelector((state: State) => state.auth)
  const { user } = useSelector((state: State) => state.auth)

  useEffect(() => {
    if (authStatus == AuthStatus.AnonymousUser) {
      navigate("/")
    }
  }, [authStatus, navigate])

  return user
}

export default useAuthenticatedRoute
