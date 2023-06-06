import axios from 'axios'
import Grid from './Grid'

export default async function Homepage() {
  const { data: properties } = await axios.get(
    `http://localhost:3333/api/property/?&take=1024`
  )

  return (
    <div className="">
      <Grid data={properties} />
    </div>
  )
}
