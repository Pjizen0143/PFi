import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/providers/theme-provider";
<<<<<<< Updated upstream
import "../globals.css"; 
=======
import SessionWatcher from "@/components/shared/session-watcher";
import Providers from "@/providers/auth-provider";
import "../globals.css";
>>>>>>> Stashed changes

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["en", "th"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <body suppressHydrationWarning>
<<<<<<< Updated upstream
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
=======
        <Providers>
          <ThemeProvider>
            <SessionWatcher>
              <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
            </SessionWatcher>
          </ThemeProvider>
        </Providers>
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
