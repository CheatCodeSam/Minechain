import React from "react"

import { BuildingLibraryIcon, CogIcon, UserIcon } from "@heroicons/react/24/outline"
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { logout } from "../features/auth/auth.actions"
import { AppDispatch, State } from "../store"

const UserHeader = () => {
  const user = useSelector((state: State) => state.auth.user!)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost m-1 gap-3 normal-case">
        <Jazzicon diameter={30} seed={jsNumberForAddress(user.publicAddress)} />
        {user.shortName}
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
        <li>
          <Link to="/account">
            <UserIcon className="h-5 w-5" /> Account
          </Link>
          <Link to="/settings">
            <CogIcon className="h-5 w-5" />
            Settings
          </Link>
          {user.isSuperUser && (
            <a href="/admin">
              <BuildingLibraryIcon className="h-5 w-5" />
              Admin
            </a>
          )}
          <button onClick={() => dispatch(logout())}>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default UserHeader
