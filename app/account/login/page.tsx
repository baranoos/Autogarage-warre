"use client";
import { useState } from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-navy pattern-dots flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Auto Garage" width={240} height={107} className="h-20 w-auto mx-auto" />
          </Link>
          <p className="text-gray-400 text-sm mt-4">Inloggen op je account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5 shadow-xl shadow-black/20">
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
              placeholder="••••••••"
              className="input-field" />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="btn-navy w-full disabled:opacity-60">
            {loading ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Nog geen account?{" "}
          <Link href="/account/register" className="text-orange-400 hover:text-orange-300 font-medium">Registreren</Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← Terug naar de webshop</Link>
        </p>
      </div>
    </div>
  );
}
