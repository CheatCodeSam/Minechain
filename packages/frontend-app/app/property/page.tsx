import Link from "next/link"

async function getProperties(page = '1') {
  const realPage = parseInt(page) - 1
  const res = await fetch(
    `http://localhost:3333/api/property/?skip=${10 * realPage}&take=10`,
    {
      cache: 'no-store',
    }
  )
  return res.json()
}

export default async function PropertyIndex(props: {
  searchParams: { page: string }
}) {
  const { data } = await getProperties(props.searchParams.page)
  return (
    <div>
      {data.map((property: any) => (
        <div key={property.id}>
          <div className="">{property.id}</div>
          <div className="">{property.ownerAddress}</div>
          <div className="">
            <Link href={`/property/${property.id}`}>View Property</Link>
          </div>
        </div>
      ))}
    </div>
  )
}
