"use client";
import { useState } from "react";
import Image from "next/image";
import { faqItems } from "@/lib/data";
import PageHeader from "@/components/PageHeader";
import { siteImages } from "@/lib/images";

export default function ContactPage() {
  const [form, setForm] = useState({ naam: "", email: "", onderwerp: "", bericht: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-surface-warm min-h-screen">
      <PageHeader
        eyebrow="Contact"
        title="Contact opnemen"
        subtitle="Heeft u vragen over onze producten of diensten? Ons team van technische experts staat klaar om u te helpen."
        image={siteImages.contact}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="card p-10 text-center border-emerald-200 bg-emerald-50/50">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-emerald-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Bericht verzonden!</h2>
                <p className="text-gray-500 text-sm">
                  Bedankt voor uw bericht. We nemen binnen 1–2 werkdagen contact met u op.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                <h2 className="font-bold text-gray-900 text-lg">Stuur ons een bericht</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Naam <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.naam}
                      onChange={(e) => setForm({ ...form, naam: e.target.value })}
                      placeholder="Uw volledige naam"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="uw@email.com"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Onderwerp <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.onderwerp}
                    onChange={(e) => setForm({ ...form, onderwerp: e.target.value })}
                    placeholder="Waar gaat uw vraag over?"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bericht <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.bericht}
                    onChange={(e) => setForm({ ...form, bericht: e.target.value })}
                    placeholder="Vertel ons hoe we u kunnen helpen..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Versturen
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Company info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={siteImages.showroom}
                alt="Onze showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white text-sm font-medium">
                Bezoek onze showroom in Antwerpen
              </p>
            </div>
            <div className="card bg-navy text-white p-7">
              <h2 className="font-bold text-lg mb-6">Bedrijfsgegevens</h2>
              <div className="space-y-5">
                {[
                  {
                    label: "Naam",
                    value: "Autogarage Warre",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ),
                  },
                  {
                    label: "Locatie",
                    value: "Industrielaan 42, 2000 Antwerpen, België",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                  },
                  {
                    label: "E-mail",
                    value: "info@autogaragewarre.be",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Telefoon",
                    value: "+32 (0)3 123 45 67",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-orange-400 mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      {icon}
                    </span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-5 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Openingsuren</span>
                  </div>
                  {[
                    { dag: "Ma – Vr:", tijd: "08:00 – 18:30" },
                    { dag: "Zaterdag:", tijd: "09:00 – 14:00" },
                    { dag: "Zondag:", tijd: "Gesloten", closed: true },
                  ].map(({ dag, tijd, closed }) => (
                    <div key={dag} className="flex justify-between text-sm py-1">
                      <span className="text-gray-400">{dag}</span>
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
          <div className="text-center mb-10">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="section-title">Veelgestelde vragen</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/80 transition-colors"
                >
                  <span className="font-medium text-navy text-sm pr-4">{item.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      openFaq === item.id ? "rotate-180" : ""
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === item.id && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed pt-4">{item.answer}</p>
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
