"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories, type Product, type StockStatus } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/queries";

type SpecRow = { key: string; value: string };

type FormState = {
  id: string;
  name: string;
  category: string;
  price: string;
  priceExVAT: string;
  description: string;
  longDescription: string;
  featuresText: string;
  stock: StockStatus;
  image: string;
  rating: string;
  reviewCount: string;
  specs: SpecRow[];
};

const defaultForm: FormState = {
  id: "",
  name: "",
  category: "Handgereedschap",
  price: "",
  priceExVAT: "",
  description: "",
  longDescription: "",
  featuresText: "",
  stock: "op-voorraad",
  image: "",
  rating: "4.5",
  reviewCount: "0",
  specs: [{ key: "", value: "" }],
};

function productToForm(p: Product): FormState {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price.toString(),
    priceExVAT: p.priceExVAT.toString(),
    description: p.description,
    longDescription: p.longDescription,
    featuresText: p.features.join("\n"),
    stock: p.stock,
    image: p.image,
    rating: p.rating.toString(),
    reviewCount: p.reviewCount.toString(),
    specs:
      Object.entries(p.specs).length > 0
        ? Object.entries(p.specs).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }],
  };
}

function formToProduct(form: FormState, isNew: boolean): Product {
  const price = parseFloat(form.price) || 0;
  const priceExVAT =
    parseFloat(form.priceExVAT) || parseFloat((price / 1.21).toFixed(2));
  const id = isNew
    ? form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : form.id;
  return {
    id,
    name: form.name,
    category: form.category,
    price,
    priceExVAT,
    description: form.description,
    longDescription: form.longDescription,
    features: form.featuresText.split("\n").filter((f) => f.trim()),
    stock: form.stock,
    image:
      form.image ||
      `https://picsum.photos/seed/${id || "product"}/800/600`,
    rating: parseFloat(form.rating) || 4.5,
    reviewCount: parseInt(form.reviewCount) || 0,
    specs: Object.fromEntries(
      form.specs
        .filter((s) => s.key.trim())
        .map((s) => [s.key.trim(), s.value.trim()])
    ),
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      loadProducts();
    });
  }, [router]);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProductList(data);
    } catch {
      setErrorMsg("Kon producten niet laden. Controleer je Supabase verbinding.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      setProductList((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setErrorMsg("Verwijderen mislukt.");
    }
    setDeleteId(null);
  }

  function openNew() {
    setEditingProduct(null);
    setForm(defaultForm);
    setErrorMsg(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm(productToForm(product));
    setErrorMsg(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) {
      setErrorMsg("Naam en prijs zijn verplicht.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const isNew = !editingProduct;
      const productData = formToProduct(form, isNew);
      if (isNew) {
        const created = await createProduct(productData);
        setProductList((prev) => [...prev, created]);
      } else {
        const updated = await updateProduct(editingProduct!.id, productData);
        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct!.id ? updated : p))
        );
      }
      setModalOpen(false);
    } catch {
      setErrorMsg("Opslaan mislukt. Controleer de ingevoerde gegevens.");
    } finally {
      setSaving(false);
    }
  }

  function setSpecRow(i: number, field: "key" | "value", val: string) {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[i] = { ...specs[i], [field]: val };
      return { ...prev, specs };
    });
  }

  function addSpecRow() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));
  }

  function removeSpecRow(i: number) {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }));
  }

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const stockLabel: Record<StockStatus, string> = {
    "op-voorraad": "Op voorraad",
    "laatste-items": "Laatste items",
    populair: "Populair",
    nabestelling: "Nabestelling",
  };

  const stockColor: Record<StockStatus, string> = {
    "op-voorraad": "bg-green-100 text-green-700",
    "laatste-items": "bg-orange-100 text-orange-700",
    populair: "bg-red-100 text-red-700",
    nabestelling: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Admin navbar */}
      <header className="bg-navy text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">Autogarage Warre</span>
          <span className="text-gray-400 text-sm">/ Beheerpaneel</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ← Naar webshop
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
            {errorMsg}
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600 ml-4">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Totaal producten", value: productList.length },
            {
              label: "Op voorraad",
              value: productList.filter((p) => p.stock === "op-voorraad").length,
            },
            {
              label: "Categorieën",
              value: new Set(productList.map((p) => p.category)).size,
            },
            {
              label: "Nabestelling",
              value: productList.filter((p) => p.stock === "nabestelling").length,
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-2xl font-bold text-navy">{loading ? "—" : value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 text-lg">Producten</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek product..."
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={openNew}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors"
              >
                + Nieuw product
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Categorie</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prijs</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-6 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-gray-500">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900">
                        € {product.price.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${stockColor[product.stock]}`}
                        >
                          {stockLabel[product.stock]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/producten/${product.id}`}
                            className="text-gray-400 hover:text-navy transition-colors text-xs"
                          >
                            Bekijk
                          </Link>
                          <button
                            onClick={() => openEdit(product)}
                            className="text-blue-500 hover:text-blue-700 transition-colors text-xs"
                          >
                            Wijzigen
                          </button>
                          {deleteId === product.id ? (
                            <span className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-semibold"
                              >
                                Bevestig
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-gray-400 hover:text-gray-600 text-xs"
                              >
                                Annuleer
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors text-xs"
                            >
                              Verwijder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">Geen producten gevonden.</div>
          )}
        </div>
      </div>

      {/* Product modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-lg text-gray-900">
                {editingProduct ? "Product wijzigen" : "Nieuw product"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
                  {errorMsg}
                </div>
              )}

              {/* Naam */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Productnaam"
                />
              </div>

              {/* Categorie + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Categorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Voorraadstatus</label>
                  <select
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value as StockStatus }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="op-voorraad">Op voorraad</option>
                    <option value="laatste-items">Laatste items</option>
                    <option value="populair">Populair</option>
                    <option value="nabestelling">Nabestelling</option>
                  </select>
                </div>
              </div>

              {/* Prijs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Prijs incl. BTW (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      const excl = v ? (parseFloat(v) / 1.21).toFixed(2) : "";
                      setForm((f) => ({ ...f, price: v, priceExVAT: excl }));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="149.95"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Prijs excl. BTW (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.priceExVAT}
                    onChange={(e) => setForm((f) => ({ ...f, priceExVAT: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="Auto-berekend"
                  />
                </div>
              </div>

              {/* Beschrijving */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Korte beschrijving</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Korte samenvatting van het product"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Uitgebreide beschrijving</label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Gedetailleerde productbeschrijving"
                />
              </div>

              {/* Kenmerken */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Kenmerken <span className="text-gray-400 font-normal">(één per regel)</span>
                </label>
                <textarea
                  value={form.featuresText}
                  onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder={"Kenmerk 1\nKenmerk 2\nKenmerk 3"}
                />
              </div>

              {/* Specificaties */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Specificaties</label>
                <div className="space-y-2">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={s.key}
                        onChange={(e) => setSpecRow(i, "key", e.target.value)}
                        placeholder="Eigenschap"
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => setSpecRow(i, "value", e.target.value)}
                        placeholder="Waarde"
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => removeSpecRow(i)}
                        className="text-gray-400 hover:text-red-500 text-sm px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addSpecRow}
                  className="mt-2 text-xs text-orange-500 hover:text-orange-600 font-semibold"
                >
                  + Specificatie toevoegen
                </button>
              </div>

              {/* Afbeelding URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Afbeelding URL
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="https://picsum.photos/seed/product/800/600"
                />
              </div>

              {/* Rating + Reviews */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Aantal reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-gray-300 text-gray-700 hover:border-gray-400 text-sm font-medium px-4 py-2 rounded transition-colors"
              >
                Annuleer
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
              >
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
