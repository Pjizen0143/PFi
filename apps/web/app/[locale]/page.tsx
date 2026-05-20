import {ThemeToggle} from "../../components/shared/theme-toggle";
import {useTranslations} from 'next-intl';
import {LanguageSwitcher} from "@/components/shared/language-switcher";


export default function Home() {
  const t = useTranslations('common');

  return (
    <>
      <ThemeToggle />
      <LanguageSwitcher />
      <h1>{t("welcome")}</h1>
    </>
  );
}
