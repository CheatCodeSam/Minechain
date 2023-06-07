import axios from 'axios'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

interface PropTypes {
  params: {
    token: string
  }
}

export default async function AccountLink(props: PropTypes) {
  const session = await getServerSession(authOptions)

  if (!session)
    redirect(
      'http://localhost:4200/signin/?next=/register/' + props.params.token
    )
  const accessToken = session.accessToken

  try {
    await axios.post(
      'http://localhost:3333/api/account-link/',
      { token: props.params.token },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (error) {
    console.log("error")
  }

  return <div className="">{props.params.token}</div>
}
