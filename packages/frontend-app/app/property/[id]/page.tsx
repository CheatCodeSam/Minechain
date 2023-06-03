import Link from 'next/link'
import axios from 'axios'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'
import Property from './Property'

export const dynamic = 'force-dynamic'

interface PropTypes {
  params: {
    id: string
  }
}

export default async function FindOne({ params }: PropTypes) {
  const id = parseInt(params.id)

  if (id > 1023 || id < 0) notFound()

  const { data: property } = await axios.get(
    `http://localhost:3333/api/property/${id}`
  )

  return (
    <div className="">
      <div>
        <Link href={'/all'}>View all properties</Link>
      </div>
      <h1>id: {property.id}</h1>

      <Property property={property} />

      <div className="">
        <span>
          {id > 0 && (
            <button>
              <Link href={`/property/${id - 1}`}>
                Previous Property {id - 1}
              </Link>
            </button>
          )}
        </span>
        <span className="ml-5">
          {id < 1023 && (
            <button>
              <Link href={`/property/${id + 1}`}>Next Property {id + 1}</Link>
            </button>
          )}
        </span>
      </div>
      <BuyButton id={id} />
    </div>
  )
}
