import React from "react"

import JwtAxios from "../JwtAxios"
import UserHeader from "./UserHeader"

const Test = () => {
  const whoami = () => JwtAxios.get("api/v1/users/whoami")
  return (
    <div className="gap-2 flex m-2">
      <button onClick={whoami} className="btn">
        Who am I?
      </button>
      <UserHeader />
    </div>
  )
}

export default Test
