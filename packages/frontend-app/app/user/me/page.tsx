import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";



async function getUser(id: string) {
  const session = await getServerSession(AuthOptions)
  console.log(session)
  const res = await fetch(`http://localhost:3333/api/user`, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  })
  return res.json()
}

export default async function WhoAmI() {
  const user = await getUser('1')
  console.log(user)
  return <div className="">Hi</div>
}
