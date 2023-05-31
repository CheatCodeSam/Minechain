import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: AuthOptions = {
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
      async authorize(credentials) {
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
  jwt: {
    maxAge: 604800
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      account.access_token = user.access_token
      return true
    },
    async jwt({ user, token, account, profile }) {
      if(account){
        token.access_token = account.access_token
        token.id = account.id
      }
      return token;
    },
    async session({session, token, user}) {
      session.access_token = token.access_token
      session.user.id = token.sub
      return session
    },
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }
