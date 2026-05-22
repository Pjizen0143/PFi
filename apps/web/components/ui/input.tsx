import { InputHTMLAttributes } from "react"

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }

export function Input({
  label,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">

      <label className="font-medium">
        {label}
      </label>

      <input
        className={`
          w-full
          rounded-xl
          bg-background
          border
          border-foreground/10
          px-4
          py-4
          outline-none
          transition
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
          ${className}
        `}
        {...props}
      />

    </div>
  )
}