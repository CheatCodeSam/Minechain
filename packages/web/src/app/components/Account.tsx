import React from "react"

import { useDispatch } from "react-redux"

import { safeMint } from "../features/nft/nft.actions"
import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"
import { AppDispatch } from "../store"

const Account = () => {
  useAuthenticatedRoute()
  const dispatch = useDispatch<AppDispatch>()

  return (
    <button className="btn" onClick={() => dispatch(safeMint(100))}>
      mint 1
    </button>
  )
}

export default Account
