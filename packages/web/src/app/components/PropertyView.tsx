import { useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"

import { initialize } from "../features/property/property.actions"
import { AppDispatch, State } from "../store"

const PropertyView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isInitialized, propertiesOwned, propertiesOwnedIds } = useSelector(
    (state: State) => state.property
  )
  const { playerLocations } = useSelector((state: State) => state.socket)

  useEffect(() => {
    if (!isInitialized) dispatch(initialize())
  }, [isInitialized, dispatch])

  return (
    <div className="">
      {propertiesOwnedIds.map((id) => {
        return <div className="">{propertiesOwned[id].tokenId}</div>
      })}
    </div>
  )
}

export default PropertyView
