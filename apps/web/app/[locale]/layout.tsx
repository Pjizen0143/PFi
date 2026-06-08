import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/providers/theme-provider";
import SessionWatcher from "@/components/shared/session-watcher";
import Providers from "@/providers/auth-provider";
import "../globals.css";

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
        <Providers>
          <ThemeProvider>
            <SessionWatcher>
              <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
            </SessionWatcher>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
