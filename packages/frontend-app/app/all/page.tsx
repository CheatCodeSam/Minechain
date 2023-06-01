import axios from 'axios'
import Link from 'next/link'
import { notFound } from "next/navigation"


interface PropTypes {
  searchParams: { page: string }
}

export default async function AllProperties({ searchParams }: PropTypes) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const maxPages = 103
  if(page > 103 || page < 0) notFound()
  const { data: properties } = await axios.get(
    `http://localhost:3333/api/property/?skip=${10 * (page - 1)}&take=10`
  )

  return (
    <div className="">
      {properties.data.map((data) => {
        return (
          <div key={data.id}>
            <div>{data.id}</div>
            <div>{data.ownerAddress}</div>
            <div>{data.price}</div>
            <div>
              <Link href={`/property/${data.id}`}>view property</Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
