import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { SocialLoginSection } from "@/features/auth/components/social-login-section";
import { Divider } from "@/components/ui/divider";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("signup");
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="mt-4 text-3xl font-bold">PFi</h1>

        <p className="text-foreground/60 mt-2">{t("title")}</p>
      </div>
      <Card className="w-full max-w-md p-8">
        <RegisterForm />

        <Divider text={t("or_continue_with")} />

        <SocialLoginSection />
      </Card>
    </main>
  );
}
