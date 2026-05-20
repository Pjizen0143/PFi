import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || '';

  const supportedLocales = ['en', 'th'];
  
  const finalLocale = supportedLocales.includes(locale) ? locale : 'th';

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});