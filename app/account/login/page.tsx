"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AccountLoginPage() {
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
    } else {
      router.push("/account");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-navy">Autogarage Warre</Link>
          <p className="text-gray-500 text-sm mt-1">Inloggen op je account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jan@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-semibold py-2.5 rounded transition-colors">
            {loading ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Nog geen account?{" "}
          <Link href="/account/register" className="text-orange-500 hover:underline font-medium">Registreren</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Terug naar de webshop</Link>
        </p>
      </div>
    </div>
  );
}
