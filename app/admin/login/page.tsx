"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError("Ongeldig e-mailadres of wachtwoord.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminRow) {
        await supabase.auth.signOut();
        setError("Dit account heeft geen beheerderstoegang.");
        setLoading(false);
        return;
      }
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 pattern-dots relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/10">
            <Image src="/logo.png" alt="Autogarage Warre" fill className="object-contain p-2" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">Autogarage Warre</p>
            <p className="text-white/50 text-sm">Beheerpaneel</p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Beheer je webshop<br />eenvoudig en overzichtelijk.
          </h1>
          <p className="text-white/60 text-lg max-w-md">
            Voeg producten toe, pas prijzen aan en houd je assortiment up-to-date.
          </p>
        </div>

        <p className="relative z-10 text-white/30 text-sm">© Autogarage Warre</p>
      </div>

      {/* Right panel – login form */}
      <div className="flex flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-navy">
              <Image src="/logo.png" alt="Autogarage Warre" fill className="object-contain p-1.5" />
            </div>
            <p className="font-bold text-navy text-lg">Autogarage Warre</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Inloggen</h2>
            <p className="text-gray-500 text-sm mt-1">Log in om het beheerpaneel te openen.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mailadres</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jouw@email.nl"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Wachtwoord</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? "Bezig met inloggen..." : "Inloggen"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
              ← Terug naar de webshop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
