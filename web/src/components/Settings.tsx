import React from "react"

import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"

const Settings = () => {
  useAuthenticatedRoute()

  return <div className="">settings</div>
}

export default Settings
