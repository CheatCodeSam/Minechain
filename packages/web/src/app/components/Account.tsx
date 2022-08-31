import React from "react"

import axios from "axios"
import { useDispatch } from "react-redux"

import { safeMint } from "../features/nft/nft.actions"
import useAuthenticatedRoute from "../hooks/useAuthenticatedRoute"
import { AppDispatch } from "../store"

const Account = () => {
  useAuthenticatedRoute()
  const dispatch = useDispatch<AppDispatch>()

  return (
    <button className="btn" onClick={() => dispatch(safeMint(3))}>
      mint 1
    </button>
  )
}

export default Account
