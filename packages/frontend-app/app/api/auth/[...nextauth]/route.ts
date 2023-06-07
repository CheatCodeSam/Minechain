import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
export const authOptions: AuthOptions = {
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
    maxAge: 604800,
  },
  callbacks: {
    async signIn({ user, account }) {
      account.user = user
      return true
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.user.access_token
        token.publicAddress = account.user.publicAddress
        token.id = account.user.id
        token.profilePicture = account.user.profilePicture
        token.displayName = account.user.displayName
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.access_token
      session.user.id = token.sub
      session.user.publicAddress = token.publicAddress
      session.user.image = token.profilePicture
      session.user.name = token.displayName
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
