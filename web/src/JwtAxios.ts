import axios from "axios"

const JwtAxios = axios.create()

JwtAxios.interceptors.request.use(
  async (config) => {
    const accessToken = window.sessionStorage.getItem("accessToken")
    config.headers = {
      Accept: "application/json"
    }
    if (accessToken) config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default JwtAxios
