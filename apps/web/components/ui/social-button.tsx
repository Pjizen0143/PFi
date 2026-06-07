import { ReactNode } from "react";

type SocialButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function SocialButton({ children, onClick }: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-foreground/10 bg-card hover:bg-background flex-1 rounded-xl border py-4 font-semibold transition hover:cursor-pointer"
    >
      {children}
    </button>
  );
}
