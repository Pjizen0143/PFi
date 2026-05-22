import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`bg-primary text-background w-full rounded-xl py-4 text-xl font-bold transition hover:cursor-pointer hover:opacity-90 active:scale-[0.99] ${className} `}
      {...props}
    >
      {children}
    </button>
  );
}
