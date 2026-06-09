"use client";
import { useState } from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-navy pattern-dots flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Auto Garage" width={180} height={80} className="h-12 w-auto mx-auto" />
          </Link>
          <p className="text-gray-400 text-sm mt-4">Maak een account aan</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4 shadow-xl shadow-black/20">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Volledige naam</label>
            <input type="text" required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jan De Vries"
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jan@example.com"
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Wachtwoord</label>
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimaal 8 tekens"
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Wachtwoord bevestigen</label>
            <input type="password" required value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Herhaal wachtwoord"
              className="input-field" />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full disabled:opacity-60">
            {loading ? "Account aanmaken..." : "Account aanmaken"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Al een account?{" "}
          <Link href="/account/login" className="text-orange-400 hover:text-orange-300 font-medium">Inloggen</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← Terug naar de webshop</Link>
        </p>
      </div>
    </div>
  );
}
