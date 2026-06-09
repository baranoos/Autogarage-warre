"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getProductReviews, addReview, updateReview, deleteReview, type Review } from "@/lib/queries";
import type { User } from "@supabase/supabase-js";

interface Props {
  productId: string;
}

function Stars({ rating, interactive = false, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={s <= (hover || rating) ? "#f97316" : "none"}
            stroke="#f97316"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ rating: 5, body: "" });
  const [error, setError] = useState("");

  const myReview = reviews.find((r) => r.userId === user?.id);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getProductReviews(productId).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.body.trim()) { setError("Schrijf een review."); return; }
    setSubmitting(true);
    setError("");
    try {
      const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Klant";
      if (editingId) {
        await updateReview(editingId, { rating: form.rating, body: form.body });
        setReviews((prev) => prev.map((r) => r.id === editingId ? { ...r, rating: form.rating, body: form.body } : r));
        setEditingId(null);
      } else {
        const created = await addReview({ productId, userId: user.id, userName, rating: form.rating, body: form.body });
        setReviews((prev) => [created, ...prev]);
      }
      setForm({ rating: 5, body: "" });
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(r: Review) {
    setEditingId(r.id);
    setForm({ rating: r.rating, body: r.body });
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Review verwijderen?")) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Klantreviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm text-gray-500">
              {avgRating.toFixed(1)} / 5 &middot; {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Review form */}
      {user ? (
        !myReview || editingId ? (
          <form id="review-form" onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 mb-8 border border-gray-100">
            <p className="font-semibold text-gray-800 mb-3 text-sm">
              {editingId ? "Review bewerken" : "Schrijf een review"}
            </p>
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Jouw beoordeling</label>
              <Stars rating={form.rating} interactive onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Vertel anderen over jouw ervaring met dit product..."
              rows={3}
              className="input-field resize-none mb-2"
            />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
              >
                {submitting ? "Verzenden..." : editingId ? "Opslaan" : "Review plaatsen"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ rating: 5, body: "" }); }}
                  className="border border-gray-300 text-gray-600 hover:border-gray-400 text-sm px-4 py-2 rounded transition-colors">
                  Annuleer
                </button>
              )}
            </div>
          </form>
        ) : null
      ) : (
        <div className="bg-surface border border-gray-100 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-600 text-sm mb-3">Log in om een review te schrijven.</p>
          <a href="/account/login" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded transition-colors inline-block">
            Inloggen
          </a>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm py-6 text-center">Nog geen reviews. Wees de eerste!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{r.userName}</p>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {user?.id === r.userId && (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(r)} className="text-xs text-blue-500 hover:text-blue-700">Bewerken</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:text-red-700">Verwijder</button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
