import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        signature: {
          type: 'Text',
          label: 'Signature',
        },
        publicAddress: {
          type: 'Text',
          label: 'Public Address',
        },
      },
      async authorize(credentials, req) {
        const signature = credentials?.signature || ''
        const publicAddress = credentials?.publicAddress || ''

        const response = await fetch('http://localhost:3333/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicAddress,
            signedNonce: signature,
          }),
        })
        return response.json()
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
})

export { handler as GET, handler as POST }
