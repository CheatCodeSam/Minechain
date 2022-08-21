import React, { useEffect } from "react"

import axios from "axios"
import { useDispatch } from "react-redux"
import { Navigate, useParams } from "react-router-dom"

import { AppDispatch } from "../store"

const Registration = () => {
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    console.log(params["jwt"])
    axios.post("api/v1/registration", { token: params["jwt"] })
  }, [])

  //   return <Navigate to="/" replace={true} />
  return <div></div>
}

export default Registration
