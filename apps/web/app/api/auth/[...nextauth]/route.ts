// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { serverApi } from '@/lib/axios';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await serverApi.post('/api/v1/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { access_token, display_name } = response.data.data;

          return {
            id: credentials.email,
            email: credentials.email,
            name: display_name,
            accessToken: access_token,
          };
        } catch{
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials login
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.displayName = user.name;
      }

      // Google login
      if (account?.id_token) {
        try {
          const res = await serverApi.post('/api/v1/auth/google', {
            id_token: account.id_token,
          });

          const { access_token, display_name } = res.data.data;
          token.accessToken = access_token;
          token.displayName = display_name;
        } catch {
          token.error = "GoogleAuthError";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.displayName = token.displayName as string;
      return session;
    },
  },

  pages: { signIn: '/login' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };