import axios, { AxiosInstance } from "axios"

import { logout } from "./features/auth/auth.actions"
import { AuthStatus } from "./features/auth/auth.types"
import { Store } from "./store"

const JwtAxios = axios.create()

export const setupInterceptor = (instance: AxiosInstance, store: Store) => {
  JwtAxios.interceptors.request.use(
    async (config) => {
      const accessToken = window.sessionStorage.getItem("accessToken")
      config.headers = {
        Accept: "application/json"
      }
      if (accessToken)
        config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` }
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )

  JwtAxios.interceptors.response.use(
    (response) => {
      return response
    },
    async function (error) {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        if (store.getState().auth.authStatus === AuthStatus.LoggedIn) {
          try {
            const response = await axios.post("/api/v1/auth/refresh")
            window.sessionStorage.setItem("accessToken", response.data.accessToken)
            return JwtAxios(originalRequest)
          } catch (error) {
            store.dispatch(logout())
          }
        }
      }
      return Promise.reject(error)
    }
  )
}

export default JwtAxios
