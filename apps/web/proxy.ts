import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'th'],

  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(de|en|th)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};