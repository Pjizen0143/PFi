import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="bg-primary text-background flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold shadow-md">
        P
      </div>

      <div>
        <p className="text-lg font-bold">PFi</p>
        <p className="text-foreground/50 text-xs">Personal Finance</p>
      </div>
    </Link>
  );
}
