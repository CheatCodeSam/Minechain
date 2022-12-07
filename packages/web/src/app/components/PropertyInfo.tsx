import React from "react"

import { useDispatch, useSelector } from "react-redux"

import { safeMint } from "../features/nft/nft.actions"
import { AppDispatch, State } from "../store"

const PropertyInfo = (props: { propertyId: number }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { propertiesOwned } = useSelector((state: State) => state.property)
  const { playerLocations, playerLocationsIds } = useSelector((state: State) => state.socket)

  const property = propertiesOwned[props.propertyId]

  const usersAtProperty: Array<string> = []

  playerLocationsIds.forEach((id) => {
    const player = playerLocations[id]
    if (player.lastKnownLocatoin === props.propertyId) usersAtProperty.push(player.publicAddress)
  })

  const getData = () => {
    if (!property)
      return (
        <button className="btn btn-primary" onClick={() => dispatch(safeMint(props.propertyId))}>
          Buy This Property
        </button>
      )
    else {
      return (
        <div className="">
          <div className="">Owned by: {property.user.publicAddress}</div>
        </div>
      )
    }
  }

  return (
    <div className="mx-6 flex-1">
      <div className="mb-7 text-xl font-bold">Property Id: {props.propertyId}</div>
      <div className="mb-7">{getData()}</div>
      <div className="border-t-2 w-full py-10">
        <div className="">Users there Now:</div>
        <ul>
          {usersAtProperty.map((playerAddress) => (
            <ul>{playerAddress}</ul>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PropertyInfo
