import React from "react"

import axios from "axios"

import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"

const Account = () => {
  useAuthenticatedRoute()
  const whoami = () => axios.get("api/v1/users/whoami")

  return (
    <button className="btn" onClick={whoami}>
      whoami
    </button>
  )
}

export default Account
