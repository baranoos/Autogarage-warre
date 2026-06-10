"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export type AdminSection = "overzicht" | "producten";

type Props = {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  userEmail?: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const navItems: { id: AdminSection; label: string; description: string; icon: ReactNode }[] = [
  {
    id: "overzicht",
    label: "Overzicht",
    description: "Statistieken en snelstart",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "producten",
    label: "Producten",
    description: "Beheer je assortiment",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

function SidebarContent({ active, onNavigate, onLogout, userEmail, onCloseMobile }: Omit<Props, "mobileOpen">) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/10 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Autogarage Warre" fill className="object-contain p-1.5" />
          </Link>
          <div>
            <Link href="/" className="font-bold text-white leading-tight hover:underline">
              Autogarage Warre
            </Link>
            <p className="text-xs text-white/50">Beheerpaneel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Menu</p>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-white/50"}>{item.icon}</span>
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`block text-xs ${isActive ? "text-white/80" : "text-white/40"}`}>
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-white/10 p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Bekijk webshop
        </Link>

        {userEmail && (
          <p className="truncate px-3 text-xs text-white/40" title={userEmail}>
            {userEmail}
          </p>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Uitloggen
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar(props: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 bg-navy border-r border-white/10 z-10">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile overlay */}
      {props.mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={props.onCloseMobile}
            aria-label="Menu sluiten"
          />
          <aside className="relative z-50 h-full w-72 bg-navy shadow-2xl">
            <SidebarContent {...props} />
          </aside>
        </div>
      )}
    </>
  );
}
