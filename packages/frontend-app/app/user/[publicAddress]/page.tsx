import Link from 'next/link'

async function getUser(id: string) {
  const res = await fetch(`http://localhost:3333/api/user/${id.toLowerCase()}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function FindOne(props: {
  params: { publicAddress: string }
}) {
  const user = await getUser(props.params.publicAddress)
  return (
    <div className="">
      <div className="">{user.publicAddress}</div>
      <div className="">{user.displayName}</div>
      {user.properties.map((property: any) => {
        return (
          <div className="" key={property.id}>
            <Link href={`/property/${property.id}`}>{property.id}</Link>
          </div>
        )
      })}
    </div>
  )
}
