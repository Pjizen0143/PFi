import Link from "next/link";
import { useTranslations } from "next-intl";

export function RegisterLink() {
  const t = useTranslations("signin");
  return (
    <div className="mt-10 text-center">
      <span className="text-zinc-500">{t("register_title")}</span>

      <Link href="/register" className="ml-2 font-bold text-green-700">
        {t("register_btn")}
      </Link>
    </div>
  );
}
