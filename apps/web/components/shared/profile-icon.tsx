"use client";

import { useSession } from "next-auth/react";
import { User, Settings, ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface ProfileIconProps {
  imageUrl?: string | null;
  name?: string | null;
  className?: string;
  onClick?: () => void;
}

export function ProfileIcon({ imageUrl, name, className, onClick }: ProfileIconProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set mounted state on client-side load to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position of the dropdown relative to the button
  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8, // 8px gap below the button
        right: window.innerWidth - rect.right,
      });
    }
  };

  // Recalculate position when opening, resizing, or scrolling
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords, { passive: true });
      window.addEventListener("scroll", updateCoords, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Do not close if clicking the button or the dropdown content itself
      if (buttonRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Resolve the image URL: prioritize passed prop, then fallback to session data
  const resolvedImageUrl = imageUrl !== undefined ? imageUrl : session?.user?.image;

  // Resolve the display name: prioritize passed prop, then fallback to session data
  const resolvedName = name !== undefined ? name : session?.displayName || session?.user?.name;

  // Resolve the email
  const resolvedEmail = session?.user?.email;

  // Get the first character of the name for fallback
  const firstChar = resolvedName?.trim().charAt(0).toUpperCase();

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          onClick?.();
        }}
        className={`border-foreground/10 bg-card hover:border-primary/30 focus:ring-primary/20 flex items-center gap-2 rounded-full border p-1 pr-3 transition-all duration-300 hover:scale-[1.02] hover:cursor-pointer focus:ring-2 focus:outline-none active:scale-[0.98] ${
          className || ""
        }`}
        aria-label={resolvedName || "Profile Menu"}
        aria-expanded={isOpen}
      >
        <div className="bg-foreground/5 relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          {resolvedImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedImageUrl}
              alt={resolvedName || "Profile"}
              className="aspect-square h-8 w-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : firstChar ? (
            <span className="text-foreground text-xs font-semibold select-none">{firstChar}</span>
          ) : (
            <User size={16} className="text-foreground/60" />
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-foreground/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={dropdownRef}
            className="border-foreground/10 bg-card animate-in fade-in slide-in-from-top-2 fixed z-9999 w-64 rounded-2xl border p-4 shadow-xl ring-1 ring-black/5 duration-200"
            style={{
              top: `${coords.top}px`,
              right: `${coords.right}px`,
            }}
          >
            {/* User info header */}
            <div className="border-foreground/10 mb-3 border-b pb-3">
              <p className="text-foreground truncate text-sm font-semibold">{resolvedName || "User"}</p>
              {resolvedEmail && <p className="text-foreground/60 truncate text-xs">{resolvedEmail}</p>}
            </div>

            <div className="flex flex-col gap-2">
              {/* Settings Link */}
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="text-foreground/80 hover:bg-foreground/5 hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition duration-200 hover:cursor-pointer"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              {/* Sign Out Button */}
              <div
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsOpen(false);
                }}
                className="text-danger/80 hover:bg-foreground/5 hover:text-danger flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition duration-200 hover:cursor-pointer"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
