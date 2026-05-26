"use client"; // อย่าลืมใส่ "use client" ที่ด้านบนสุดของไฟล์ หากยังไม่มี เพื่อให้ระบบธีมทำงานร่วมกับ className ได้สมบูรณ์

import { Navbar } from "@/components/shared/navbar";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function WelcomePage() {
  const t = useTranslations("start");

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
        <div className="bg-primary text-background mb-6 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl font-bold shadow-xl">
          P
        </div>

        <h1 className="max-w-3xl text-5xl leading-tight font-black">
          {t("title")}
          <span className="text-brand-green"> {t("title_highlight")}</span>
        </h1>

        <p className="text-foreground/60 mt-6 max-w-xl text-lg">{t("description")}</p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="bg-primary text-background rounded-full px-8 py-4 font-semibold transition-transform hover:scale-105"
          >
            {t("get_started")}
          </Link>

          <Link
            href="/signin"
            className="border-foreground/10 bg-card rounded-full border px-8 py-4 font-semibold transition-transform hover:scale-105"
          >
            {t("signin")}
          </Link>
        </div>
      </section>
    </main>
  );
}
