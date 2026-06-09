import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    displayName?: string;
    error?: string;
    
  }
  interface User {
    accessToken?: string;
    displayName?: string;
    expiresIn?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    displayName?: string;
    accessTokenExpiresAt?: number;
    error?: string;
    
  }
}