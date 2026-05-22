import { ReactNode } from "react"

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({
  children,
  className
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        bg-card
        text-foreground
        shadow-lg
        border
        border-foreground/5
        ${className}
      `}
    >
      {children}
    </div>
  )
}