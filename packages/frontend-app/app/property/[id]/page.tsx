import Link from 'next/link'

async function getProperty(id: string) {
  const res = await fetch(`http://localhost:3333/api/property/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function FindOne(props: { params: { id: string } }) {
  const property = await getProperty(props.params.id)
  return (
    <div className="">
      <div className="">
        <Link href={`/user/${property.ownerAddress}`}>
          {property.ownerAddress}
        </Link>
      </div>
      <div className="">{property.price}</div>
      <button className="underline">Buy</button>
    </div>
  )
}