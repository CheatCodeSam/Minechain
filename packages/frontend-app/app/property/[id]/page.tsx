import Link from 'next/link'
import BuyButton from '../../components/BuyButton'

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
        <Link className='underline' href={`/user/${property.ownerAddress}`}>
          {property.ownerAddress}
        </Link>
      </div>
      <div className="">{property.price}</div>
      <BuyButton id={parseInt(props.params.id)}/>
    </div>
  )
}
