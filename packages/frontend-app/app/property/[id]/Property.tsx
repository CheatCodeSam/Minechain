'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from "../../store"


interface PropTypes {
  property: {
    id: number
    ownerAddress: string
    price: string
    deposit: string
    lastTaxPaidDate: string
    lastPriceChangeDate: string
    cumulativePrice: string
    priceChangeCount: number
    dueNow: string
    dueNext: string
  }
}

export default function Property(props: PropTypes) {
  const propsProperty = props.property
  const reduxProperties = useSelector((state: RootState) => state.property.properties)
  const reduxProperty = reduxProperties[props.property.id]

  const property = reduxProperty || propsProperty


  return (
    <div className="">
      <div className="">
        <Link className="underline" href={`/`}>
          {property.ownerAddress}
        </Link>
      </div>
      <div className="">{property.price}</div>
    </div>
  )
}
