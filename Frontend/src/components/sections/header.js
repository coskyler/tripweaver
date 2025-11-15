"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleLoginButton from "../home/GoogleLoginButton";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  const getInitials = () => {
    if (!user) return "U";
    const base = user.displayName || user.email || "";
    const parts = base.trim().split(/\s+/);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
      router.push("/");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <header className="border-b border-green-900/25">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand + Your Tours */}
        <div className="flex items-center gap-4">
          {/* Brand (clickable) */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-90"
            onClick={() => router.push("/")}
          >
            {/* Tour/Pathfinding SVG logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
              className="w-8 h-8 text-green-900"
            >
              {/* Route line */}
              <path
                d="M8 36 C16 28, 24 20, 40 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Start point */}
              <circle cx="8" cy="36" r="4" fill="currentColor" />
              {/* End point */}
              <circle
                cx="40"
                cy="12"
                r="4"
                fill="white"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>

            <h1 className="text-2xl font-semibold text-green-900">
              Tourweaver
            </h1>
          </div>

          {/* Your Tours button */}
          <button
            onClick={() => router.push("/tours")}
            className={`ml-6 text-md text-green-900 hover:underline underline-offset-2 cursor-pointer hover:text-green-700 ${!user ? "invisible" : ""}`}
          >
            Your Tours
          </button>
        </div>

        {/* Right-side actions */}
        <nav className="flex items-center gap-6 relative">
          {/* Avatar with initials + logout box */}
          <div className={`relative ${!user ? "invisible" : ""}`}>
            <div
              className="h-9 w-9 rounded-full bg-gradient-to-br from-green-700 to-green-900 text-white grid place-items-center font-bold text-lg cursor-pointer"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              {getInitials()}
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-30 rounded-md bg-white shadow-lg text-sm z-100 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full font-semibold text-center px-2 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
