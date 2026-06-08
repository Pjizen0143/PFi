import { MainNavbar } from "@/components/shared/main-navbar";

export default function MainLocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar />
      <main>{children}</main>
    </div>
  );
}
