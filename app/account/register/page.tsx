"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || form.fullName.trim().length < 2) { setError("Voer een geldige naam in (minimaal 2 tekens)."); return; }
    if (form.password !== form.confirm) { setError("Wachtwoorden komen niet overeen."); return; }
    if (form.password.length < 8) { setError("Wachtwoord moet minimaal 8 tekens bevatten."); return; }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });

    if (authError) {
      setError(authError.message === "User already registered"
        ? "Dit e-mailadres is al in gebruik."
        : "Registratie mislukt. Probeer opnieuw.");
      setLoading(false);
    } else {
      router.push("/account?welkom=1");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-navy">Autogarage Warre</Link>
          <p className="text-gray-500 text-sm mt-1">Maak een account aan</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Volledige naam</label>
            <input type="text" required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jan De Vries"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
          </div>
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
              placeholder="Minimaal 8 tekens"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord bevestigen</label>
            <input type="password" required value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Herhaal wachtwoord"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded transition-colors">
            {loading ? "Account aanmaken..." : "Account aanmaken"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          Al een account?{" "}
          <Link href="/account/login" className="text-orange-500 hover:underline font-medium">Inloggen</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Terug naar de webshop</Link>
        </p>
      </div>
    </div>
  );
}
