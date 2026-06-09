"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { categories, type Product, type StockStatus } from "@/lib/data";
import type { FormState, ModalImage } from "./product-form";

export type { FormState, ModalImage, SpecRow } from "./product-form";

type Tab = "basis" | "beschrijving" | "fotos" | "extra";

type Props = {
  open: boolean;
  editingProduct: Product | null;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  modalImages: ModalImage[];
  saving: boolean;
  errorMsg: string | null;
  onClose: () => void;
  onSave: () => void;
  addImageFiles: (files: FileList) => void;
  removeModalImage: (i: number) => void;
  moveImage: (i: number, dir: -1 | 1) => void;
  setCover: (i: number) => void;
  setSpecRow: (i: number, field: "key" | "value", val: string) => void;
};

const tabs: { id: Tab; label: string }[] = [
  { id: "basis", label: "Basisgegevens" },
  { id: "beschrijving", label: "Beschrijving" },
  { id: "fotos", label: "Foto's" },
  { id: "extra", label: "Extra" },
];

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function ProductModal({
  open,
  editingProduct,
  form,
  setForm,
  modalImages,
  saving,
  errorMsg,
  onClose,
  onSave,
  addImageFiles,
  removeModalImage,
  moveImage,
  setCover,
  setSpecRow,
}: Props) {
  const [tab, setTab] = useState<Tab>("basis");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
              {editingProduct ? "Bewerken" : "Nieuw"}
            </p>
            <h3 className="font-bold text-xl text-gray-900">
              {editingProduct ? editingProduct.name : "Product toevoegen"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Sluiten"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 border-b border-gray-100 overflow-x-auto shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                tab === t.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {tab === "basis" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Productnaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  placeholder="Bijv. Momentsleutel Pro-Series"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Categorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Voorraadstatus</label>
                  <select
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value as StockStatus }))}
                    className={inputClass}
                  >
                    <option value="op-voorraad">Op voorraad</option>
                    <option value="laatste-items">Laatste items</option>
                    <option value="populair">Populair</option>
                    <option value="nabestelling">Nabestelling</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Prijs incl. BTW (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({
                        ...f,
                        price: v,
                        priceExVAT: v ? (parseFloat(v) / 1.21).toFixed(2) : "",
                      }));
                    }}
                    className={inputClass}
                    placeholder="149.95"
                  />
                </div>
                <div>
                  <label className={labelClass}>Prijs excl. BTW (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.priceExVAT}
                    onChange={(e) => setForm((f) => ({ ...f, priceExVAT: e.target.value }))}
                    className={inputClass}
                    placeholder="Automatisch berekend"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "beschrijving" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Korte beschrijving</label>
                <p className="text-xs text-gray-400 mb-2">Zichtbaar op de productenpagina en in overzichten.</p>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Een korte samenvatting van het product..."
                />
              </div>
              <div>
                <label className={labelClass}>Uitgebreide beschrijving</label>
                <p className="text-xs text-gray-400 mb-2">Volledige tekst op de productdetailpagina.</p>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Uitgebreide productinformatie..."
                />
              </div>
              <div>
                <label className={labelClass}>Kenmerken</label>
                <p className="text-xs text-gray-400 mb-2">Één kenmerk per regel, bijv. &quot;18V accu&quot;.</p>
                <textarea
                  value={form.featuresText}
                  onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder={"Kenmerk 1\nKenmerk 2\nKenmerk 3"}
                />
              </div>
            </div>
          )}

          {tab === "fotos" && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Productfoto&apos;s</label>
                <p className="text-sm text-gray-500 mb-4">
                  Klik op een foto om die als voorblad in te stellen. Gebruik de pijltjes om de volgorde te wijzigen.
                </p>
              </div>

              {modalImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {modalImages.map((img, i) => (
                    <div
                      key={i}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-colors ${
                        img.isCover ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="w-full h-28 object-cover" />
                      {img.isCover && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Voorblad
                        </span>
                      )}
                      <div className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => setCover(i)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold w-full"
                          >
                            Als voorblad
                          </button>
                        )}
                        <div className="flex gap-1 w-full">
                          <button
                            type="button"
                            onClick={() => moveImage(i, -1)}
                            disabled={i === 0}
                            className="flex-1 bg-white/90 hover:bg-white text-gray-700 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, 1)}
                            disabled={i === modalImages.length - 1}
                            className="flex-1 bg-white/90 hover:bg-white text-gray-700 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                          >
                            →
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeModalImage(i)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold w-full"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 hover:border-orange-400 hover:bg-orange-50/50 transition-colors group">
                <svg
                  className="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-600 group-hover:text-orange-600">
                  Klik om foto&apos;s te uploaden
                </span>
                <span className="text-xs text-gray-400">JPG, PNG of WebP · max. 5 MB per foto</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addImageFiles(e.target.files)}
                />
              </label>
            </div>
          )}

          {tab === "extra" && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Specificaties</label>
                <p className="text-xs text-gray-400 mb-3">Technische details zoals gewicht, materiaal, etc.</p>
                <div className="space-y-2">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={s.key}
                        onChange={(e) => setSpecRow(i, "key", e.target.value)}
                        placeholder="Eigenschap"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => setSpecRow(i, "value", e.target.value)}
                        placeholder="Waarde"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }))}
                        className="text-gray-400 hover:text-red-500 p-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }))}
                  className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-semibold"
                >
                  + Specificatie toevoegen
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className={labelClass}>Beoordeling (0–5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Aantal reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-200 text-gray-700 hover:bg-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
          >
            {saving ? "Bezig met opslaan..." : "Product opslaan"}
          </button>
        </div>
      </div>
    </div>
  );
}
