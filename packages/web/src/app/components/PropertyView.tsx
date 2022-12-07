import { useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"

import { initialize } from "../features/property/property.actions"
import { propertyActions } from "../features/property/property.slice"
import { AppDispatch, State } from "../store"
import PropertyInfo from "./PropertyInfo"

const PropertyView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isInitialized, propertiesOwned, propertiesOwnedIds, selectedProperty } = useSelector(
    (state: State) => state.property
  )
  const { user } = useSelector((state: State) => state.auth)

  useEffect(() => {
    if (!isInitialized) dispatch(initialize())
  }, [isInitialized, dispatch])

  let index = -1
  const numberOfTokens = 1024
  const widthOfGrid = Math.sqrt(numberOfTokens)

  const getColor = (index: number) => {
    if (!propertiesOwnedIds.includes(index)) return "bg-slate-500"
    else if (propertiesOwned[index].userId === user?.id) return "bg-green-500"
    else return "bg-red-500"
  }

  const clikced = (dex: number) => dispatch(propertyActions.selectProperty(dex))

  return (
    <div className="mx-16 mt-10">
      <div className="flex">
        <div className="">
          <table>
            <tbody>
              {[...Array(widthOfGrid)].map((y) => (
                <tr key={y}>
                  {[...Array(widthOfGrid)].map((x) => {
                    index++
                    const g = index
                    return (
                      <td
                        className={
                          " border border-white m-0.5 inline-block w-5 h-5 cursor-pointer " +
                          getColor(index)
                        }
                        key={index}
                        onClick={() => clikced(g)}
                      ></td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedProperty !== null ? (
          <PropertyInfo propertyId={selectedProperty} />
        ) : (
          <div>Please select a Property</div>
        )}
      </div>
    </div>
  )
}

export default PropertyView
