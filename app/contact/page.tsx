"use client";
import { useState } from "react";
import { faqItems } from "@/lib/data";

export default function ContactPage() {
  const [form, setForm] = useState({ naam: "", email: "", onderwerp: "", bericht: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact opnemen</h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Heeft u vragen over onze producten of diensten? Neem contact met ons op. Ons team van
            technische experts staat klaar om u te helpen met uw automotive behoeften.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-14">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-green-500 mx-auto mb-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Bericht verzonden!</h2>
                <p className="text-gray-500 text-sm">
                  Bedankt voor uw bericht. We nemen binnen 1–2 werkdagen contact met u op.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Naam <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.naam}
                      onChange={(e) => setForm({ ...form, naam: e.target.value })}
                      placeholder="Uw volledige naam"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="uw@email.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Onderwerp <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.onderwerp}
                    onChange={(e) => setForm({ ...form, onderwerp: e.target.value })}
                    placeholder="Waar gaat uw vraag over?"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bericht <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.bericht}
                    onChange={(e) => setForm({ ...form, bericht: e.target.value })}
                    placeholder="Vertel ons hoe we u kunnen helpen..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded transition-colors"
                >
                  Versturen
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Company info card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-navy rounded-xl p-6 text-white">
              <h2 className="font-bold text-lg mb-5">Bedrijfsgegevens</h2>
              <div className="space-y-4">
                {[
                  {
                    label: "NAAM",
                    value: "Autogarage Warre",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ),
                  },
                  {
                    label: "LOCATIE",
                    value: "Industrielaan 42, 2000 Antwerpen, België",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                  },
                  {
                    label: "E-MAIL",
                    value: "info@autogaragewarre.be",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                  },
                  {
                    label: "TELEFOON",
                    value: "+32 (0)3 123 45 67",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-orange-400 mt-0.5 shrink-0">{icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center gap-2 mb-3 text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-white">Openingsuren</span>
                  </div>
                  {[
                    { dag: "Ma – Vr:", tijd: "08:00 – 18:30" },
                    { dag: "Zaterdag:", tijd: "09:00 – 14:00" },
                    { dag: "Zondag:", tijd: "Gesloten", closed: true },
                  ].map(({ dag, tijd, closed }) => (
                    <div key={dag} className="flex justify-between text-sm py-0.5">
                      <span className="text-gray-300">{dag}</span>
                      <span className={closed ? "text-orange-400" : "text-white"}>{tijd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Veelgestelde Vragen
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mb-8 rounded" />
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-navy text-sm">{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`shrink-0 transition-transform ${
                      openFaq === item.id ? "rotate-180" : ""
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === item.id && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
