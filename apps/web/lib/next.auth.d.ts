import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    displayName?: string;
  }
  interface User {
    accessToken?: string;
    name?: string;
    expiresIn?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    displayName?: string;
    accessTokenExpiresAt?: number;
  }
}