'use client'

import Link from 'next/link'

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
  const { property } = props
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
