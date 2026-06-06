import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"


declare module "next-auth" {
  interface Session {
    idToken?: string
    accessToken?: string

    user: DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string
    accessToken?: string
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
      }

      return token
    },

    async session({ session, token }) {
      session.idToken = token.idToken as string

      return session
    },
  },
})