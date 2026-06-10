"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/producten", label: "Producten" },
    { href: "/contact", label: "Contact" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function checkAdmin(userId: string) {
    const { data } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    setIsAdmin(!!data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id);
      else {
        setIsAdmin(false);
        setDropdownOpen(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  const linkClass = (href: string) =>
    `block text-base font-semibold px-4 py-3.5 rounded-xl transition-all duration-200 ${
      isActive(href)
        ? "text-white bg-white/10"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="bg-navy/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20 gap-4">
        <Link href="/" className="shrink-0 flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <Image
            src="/logo.png"
            alt="Auto Garage Tools & Equipment"
            width={240}
            height={107}
            className="h-16 w-auto sm:h-[4.5rem]"
            priority
          />
        </Link>

        <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(href)
                  ? "text-white bg-white/10 shadow-inner"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop account */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors px-2 py-1 rounded"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAdmin ? "bg-orange-500" : "bg-white/20"}`}
                  >
                    {isAdmin ? "A" : displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{isAdmin ? "Admin" : displayName}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {isAdmin ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-400">Ingelogd als admin</p>
                          <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Beheerpaneel
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-700">{displayName}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Mijn account
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className="flex items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden md:inline">Inloggen</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="sm:hidden flex items-center justify-center w-11 h-11 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-20 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Menu sluiten"
          />
          <div className="relative bg-navy border-t border-white/10 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-5 space-y-1">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Navigatie</p>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClass(href)}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-5">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Account</p>
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${isAdmin ? "bg-orange-500" : "bg-white/20"}`}
                    >
                      {isAdmin ? "A" : displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {isAdmin ? "Beheerder" : displayName}
                      </p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3.5 rounded-xl transition-colors"
                    >
                      Beheerpaneel
                    </Link>
                  ) : (
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3.5 rounded-xl transition-colors"
                    >
                      Mijn account
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-base font-semibold text-red-400 hover:bg-red-500/10 px-4 py-3.5 rounded-xl transition-colors"
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <Link
                  href="/account/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-3.5 rounded-xl transition-colors"
                >
                  Inloggen
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
