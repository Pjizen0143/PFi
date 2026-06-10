"use client";

import { useState, useEffect } from "react";
import { MainNavbar } from "@/components/shared/main-navbar";
import { Sidebar } from "@/components/shared/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size and auto-manage sidebar
  useEffect(() => {
    const checkDesktop = () => {
      const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktop(isLargeScreen);
      setSidebarOpen(isLargeScreen);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const closeSidebarMobile = () => {
    if (isDesktop) return;
    setSidebarOpen(false);
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MainNavbar onMenuClick={toggleSidebar} />

      <div className="relative flex flex-1 pt-16">
        <Sidebar mobileOpen={sidebarOpen} desktopOpen={sidebarOpen} onCloseMobile={closeSidebarMobile} />

        <div className={`flex flex-1 flex-col ${sidebarOpen ? "md:ml-64" : ""}`}>
          <main className="@container flex-1 p-6 pt-6 md:p-8 md:pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
