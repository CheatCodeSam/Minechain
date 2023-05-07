import React from "react"
import { useDispatch } from "react-redux"
import { login } from '../../features/auth/auth.actions'
import { AppDispatch } from "../store"


const LoginButton = () => {
    const dispatch = useDispatch<AppDispatch>()

    return <button onClick={() => dispatch(login())}>Login</button>
}

export default LoginButton