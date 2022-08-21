import React, { useEffect } from "react"

import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"

import { setLoginRedirect } from "../features/auth/auth.slice"
import { AuthStatus } from "../features/auth/auth.types"
import { AppDispatch, State } from "../store"

const Registration = () => {
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { authStatus } = useSelector((state: State) => state.auth)

  useEffect(() => {
    if (authStatus === AuthStatus.LoggedIn)
      axios.post("api/v1/registration", { token: params["jwt"] })
    else if (authStatus === AuthStatus.AnonymousUser)
      dispatch(setLoginRedirect("/register/" + params["jwt"]))
  }, [authStatus, params, dispatch])

  if (authStatus === AuthStatus.AnonymousUser) {
    return <Navigate to={"/login"} replace={true} />
  } else if (authStatus === AuthStatus.LoggedIn) {
    return <Navigate to={"/"} replace={true} />
  } else {
    return <div>pending reg</div>
  }
}

export default Registration
