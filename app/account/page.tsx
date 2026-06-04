"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Suspense } from "react";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const welkom = searchParams.get("welkom") === "1";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/account/login"); return; }
      setUser(user);
      setName(user.user_metadata?.full_name || "");
      setLoading(false);
    });
  }, [router]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: name } });
    await supabase.from("profiles").update({ full_name: name }).eq("id", user!.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {welkom && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
            Welkom bij Autogarage Warre! Je account is aangemaakt.
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn account</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors">
            Uitloggen
          </button>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Profielgegevens</h2>
          <form onSubmit={handleSaveName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
              <input type="email" value={user?.email || ""} disabled
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
              {saved && <span className="text-green-600 text-sm">✓ Opgeslagen</span>}
            </div>
          </form>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Snel naar</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/producten"
              className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 hover:border-orange-500 transition-colors text-sm text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Alle producten
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 hover:border-orange-500 transition-colors text-sm text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Laden...</div>}>
      <AccountContent />
    </Suspense>
  );
}
