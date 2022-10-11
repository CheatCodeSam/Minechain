
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { AuthStatus } from "../features/auth/auth.types"
import { State } from "../store"


const LogoutPage = () => {
    const { authStatus } = useSelector((state: State) => state.auth)
  const state = useLocation().state as { redirect?: string }

  if (authStatus === AuthStatus.AnonymousUser) {
    return <Navigate to={state?.redirect || "/login"} />
  }
  else {
    return (
      <div>
        Dedicated Logout Page
      </div>
    )
  }
}

  
  export default LogoutPage
  