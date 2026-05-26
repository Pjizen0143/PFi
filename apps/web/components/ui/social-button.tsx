import { ReactNode } from "react";

type SocialButtonProps = {
  children: ReactNode;
};

export function SocialButton({ children }: SocialButtonProps) {
  return (
    <button className="border-foreground/10 bg-card hover:bg-background flex-1 rounded-xl border py-4 font-semibold transition hover:cursor-pointer">
      {children}
    </button>
  );
}
