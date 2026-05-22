import { Card } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";
import { SocialLoginSection } from "@/features/auth/components/social-login-section";
import { RegisterLink } from "@/features/auth/components/register-link";
import { Divider } from "@/components/ui/divider";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("signin");
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-primary text-background flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-bold shadow-lg">
            P
          </div>

          <h1 className="mt-4 text-3xl font-bold">PFi</h1>

          <p className="text-foreground/60 mt-2">{t("title")}</p>
        </div>

        <LoginForm />

        <Divider text={t("or_continue_with")} />

        <SocialLoginSection />

        <RegisterLink />
      </Card>
    </main>
  );
}
