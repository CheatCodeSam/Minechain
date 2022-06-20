import React from "react"

import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"

const Settings = () => {
  useAuthenticatedRoute()

  return <div>settings</div>
}

export default Settings
