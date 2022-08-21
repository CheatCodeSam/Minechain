import React, { useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"

import { registerMojang } from "../features/auth/auth.actions"
import { AuthStatus } from "../features/auth/auth.types"
import { AppDispatch, State } from "../store"

const Registration = () => {
  const { jwt } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { authStatus } = useSelector((state: State) => state.auth)

  useEffect(() => {
    if (authStatus === AuthStatus.LoggedIn) dispatch(registerMojang(jwt!))
  }, [authStatus, jwt, dispatch])

  if (authStatus === AuthStatus.AnonymousUser) {
    return <Navigate to={"/login"} replace={true} state={{ redirect: `/register/${jwt}` }} />
  } else if (authStatus === AuthStatus.LoggedIn) {
    return <Navigate to={"/"} replace={true} />
  } else {
    return <div>pending reg</div>
  }
}

export default Registration
