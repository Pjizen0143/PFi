type DividerProps = {
  text: string
}

export function Divider({
  text
}: DividerProps) {
  return (
    <div className="flex items-center gap-4 my-8">

      <div className="h-px flex-1 bg-foreground/10" />

      <span className="text-sm text-foreground/50">
        {text}
      </span>

      <div className="h-px flex-1 bg-foreground/10" />

    </div>
  )
}