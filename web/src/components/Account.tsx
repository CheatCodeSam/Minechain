import React from "react"

import JwtAxios from "../JwtAxios"
import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"

const Account = () => {
  useAuthenticatedRoute()
  const whoami = () => JwtAxios.get("api/v1/users/whoami")

  return (
    <button className="btn" onClick={whoami}>
      whoami
    </button>
  )
}

export default Account
