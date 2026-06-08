"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      alert("เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      signOut({ callbackUrl: "/signin" });
    }
  }, [session]);

  return <>{children}</>;
}
