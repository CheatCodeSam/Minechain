'use client'
import { useSession } from 'next-auth/react'
import SignInButton from '../LoginButton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PropTypes {
  searchParams: { next: string }
}

export default function SignIn(props: PropTypes) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push(props.searchParams.next)
  }, [props, router, session])

  return (
    <div className="">
      <SignInButton />
    </div>
  )
}
