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
  uploadProductImage,
  getProductImages,
  setProductImages,
} from "@/lib/queries";

// ─── Types ──────────────────────────────────────────────────────────────────

type SpecRow = { key: string; value: string };

type ModalImage = {
  id?: string;
  url: string;
  file?: File;
  isCover: boolean;
};

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
  rating: string;
  reviewCount: string;
  specs: SpecRow[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const defaultForm: FormState = {
  id: "", name: "", category: "Handgereedschap",
  price: "", priceExVAT: "", description: "", longDescription: "",
  featuresText: "", stock: "op-voorraad",
  rating: "4.5", reviewCount: "0",
  specs: [{ key: "", value: "" }],
};

function productToForm(p: Product): FormState {
  return {
    id: p.id, name: p.name, category: p.category,
    price: p.price.toString(), priceExVAT: p.priceExVAT.toString(),
    description: p.description, longDescription: p.longDescription,
    featuresText: p.features.join("\n"), stock: p.stock,
    rating: p.rating.toString(), reviewCount: p.reviewCount.toString(),
    specs: Object.entries(p.specs).length > 0
      ? Object.entries(p.specs).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }],
  };
}

function formToProduct(form: FormState, isNew: boolean, coverUrl: string): Product {
  const price = parseFloat(form.price) || 0;
  const id = isNew
    ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : form.id;
  return {
    id, name: form.name, category: form.category, price,
    priceExVAT: parseFloat(form.priceExVAT) || parseFloat((price / 1.21).toFixed(2)),
    description: form.description, longDescription: form.longDescription,
    features: form.featuresText.split("\n").filter((f) => f.trim()),
    stock: form.stock,
    image: coverUrl || `https://picsum.photos/seed/${id || "product"}/800/600`,
    rating: parseFloat(form.rating) || 4.5,
    reviewCount: parseInt(form.reviewCount) || 0,
    specs: Object.fromEntries(form.specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()])),
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [modalImages, setModalImages] = useState<ModalImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/admin/login"); return; }
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!adminRow) { router.replace("/"); return; }
      loadProducts();
    });
  }, [router]);

  async function loadProducts() {
    setLoading(true);
    try { setProductList(await getAllProducts()); }
    catch { setErrorMsg("Kon producten niet laden."); }
    finally { setLoading(false); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    try { await deleteProduct(id); setProductList((prev) => prev.filter((p) => p.id !== id)); }
    catch { setErrorMsg("Verwijderen mislukt."); }
    setDeleteId(null);
  }

  // ─── Modal open/close ───────────────────────────────────────────────────

  function openNew() {
    setEditingProduct(null);
    setForm(defaultForm);
    setModalImages([]);
    setErrorMsg(null);
    setModalOpen(true);
  }

  async function openEdit(product: Product) {
    setEditingProduct(product);
    setForm(productToForm(product));
    setErrorMsg(null);
    const existing = await getProductImages(product.id);
    if (existing.length > 0) {
      setModalImages(existing.map((img, i) => ({ id: img.id, url: img.url, isCover: img.isCover || i === 0 })));
    } else {
      setModalImages(product.image ? [{ url: product.image, isCover: true }] : []);
    }
    setModalOpen(true);
  }

  // ─── Image management ───────────────────────────────────────────────────

  function addImageFiles(files: FileList) {
    const newImgs: ModalImage[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isCover: false,
    }));
    setModalImages((prev) => {
      const combined = [...prev, ...newImgs];
      if (!combined.some((img) => img.isCover)) combined[0].isCover = true;
      return combined;
    });
  }

  function removeModalImage(i: number) {
    setModalImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length > 0 && !next.some((img) => img.isCover)) next[0].isCover = true;
      return next;
    });
  }

  function moveImage(i: number, dir: -1 | 1) {
    setModalImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function setCover(i: number) {
    setModalImages((prev) => prev.map((img, idx) => ({ ...img, isCover: idx === i })));
  }

  // ─── Save ────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name.trim() || !form.price) { setErrorMsg("Naam en prijs zijn verplicht."); return; }
    setSaving(true);
    setErrorMsg(null);
    try {
      const isNew = !editingProduct;

      // 1. Upload new image files
      const tempId = isNew
        ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : editingProduct!.id;

      const resolvedImages = await Promise.all(
        modalImages.map(async (img) => {
          if (img.file) {
            const url = await uploadProductImage(img.file, tempId);
            return { ...img, url };
          }
          return img;
        })
      );

      const coverUrl = resolvedImages.find((img) => img.isCover)?.url
        || resolvedImages[0]?.url
        || "";

      const productData = formToProduct(form, isNew, coverUrl);

      // 2. Save product
      let savedProduct: Product;
      if (isNew) {
        savedProduct = await createProduct(productData);
        setProductList((prev) => [...prev, savedProduct]);
      } else {
        savedProduct = await updateProduct(editingProduct!.id, productData);
        setProductList((prev) => prev.map((p) => p.id === editingProduct!.id ? savedProduct : p));
      }

      // 3. Save product images
      await setProductImages(
        savedProduct.id,
        resolvedImages.map((img, i) => ({ url: img.url, sortOrder: i, isCover: img.isCover }))
      );

      setModalOpen(false);
    } catch (e) {
      console.error(e);
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

  // ─── Derived ─────────────────────────────────────────────────────────────

  const filtered = productList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const stockLabel: Record<StockStatus, string> = {
    "op-voorraad": "Op voorraad", "laatste-items": "Laatste items",
    populair: "Populair", nabestelling: "Nabestelling",
  };
  const stockColor: Record<StockStatus, string> = {
    "op-voorraad": "bg-green-100 text-green-700",
    "laatste-items": "bg-orange-100 text-orange-700",
    populair: "bg-red-100 text-red-700",
    nabestelling: "bg-gray-100 text-gray-600",
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-navy text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">Autogarage Warre</span>
          <span className="text-gray-400 text-sm">/ Beheerpaneel</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">← Naar webshop</Link>
          <button onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition-colors">
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
            { label: "Op voorraad", value: productList.filter((p) => p.stock === "op-voorraad").length },
            { label: "Categorieën", value: new Set(productList.map((p) => p.category)).size },
            { label: "Nabestelling", value: productList.filter((p) => p.stock === "nabestelling").length },
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
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek product..."
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500" />
              <button onClick={openNew}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors">
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
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td></tr>
                  ))
                  : filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-gray-500">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900">€ {product.price.toFixed(2).replace(".", ",")}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${stockColor[product.stock]}`}>
                          {stockLabel[product.stock]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/producten/${product.id}`}
                            className="text-gray-400 hover:text-navy transition-colors text-xs">Bekijk</Link>
                          <button onClick={() => openEdit(product)}
                            className="text-blue-500 hover:text-blue-700 transition-colors text-xs">Wijzigen</button>
                          {deleteId === product.id ? (
                            <span className="flex items-center gap-1">
                              <button onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-semibold">Bevestig</button>
                              <button onClick={() => setDeleteId(null)}
                                className="text-gray-400 hover:text-gray-600 text-xs">Annuleer</button>
                            </span>
                          ) : (
                            <button onClick={() => setDeleteId(product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors text-xs">Verwijder</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">Geen producten gevonden.</div>
          )}
        </div>
      </div>

      {/* ─── Product modal ──────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h3 className="font-bold text-lg text-gray-900">
                {editingProduct ? "Product wijzigen" : "Nieuw product"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">{errorMsg}</div>
              )}

              {/* Naam */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Naam <span className="text-red-500">*</span></label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Productnaam" />
              </div>

              {/* Categorie + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Categorie</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Voorraadstatus</label>
                  <select value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value as StockStatus }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500">
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prijs incl. BTW (€) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" value={form.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({ ...f, price: v, priceExVAT: v ? (parseFloat(v) / 1.21).toFixed(2) : "" }));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="149.95" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prijs excl. BTW (€)</label>
                  <input type="number" step="0.01" value={form.priceExVAT}
                    onChange={(e) => setForm((f) => ({ ...f, priceExVAT: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                    placeholder="Auto-berekend" />
                </div>
              </div>

              {/* Beschrijving */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Korte beschrijving</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Korte samenvatting" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Uitgebreide beschrijving</label>
                <textarea value={form.longDescription} onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
                  rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Gedetailleerde productbeschrijving" />
              </div>

              {/* Kenmerken */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Kenmerken <span className="text-gray-400 font-normal">(één per regel)</span></label>
                <textarea value={form.featuresText} onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                  rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  placeholder={"Kenmerk 1\nKenmerk 2"} />
              </div>

              {/* Specificaties */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Specificaties</label>
                <div className="space-y-2">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={s.key} onChange={(e) => setSpecRow(i, "key", e.target.value)}
                        placeholder="Eigenschap"
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                      <input type="text" value={s.value} onChange={(e) => setSpecRow(i, "value", e.target.value)}
                        placeholder="Waarde"
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                      <button onClick={() => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }))}
                        className="text-gray-400 hover:text-red-500 text-sm px-1">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setForm((f) => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }))}
                  className="mt-2 text-xs text-orange-500 hover:text-orange-600 font-semibold">
                  + Specificatie toevoegen
                </button>
              </div>

              {/* ─── Foto's ────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Productfoto&apos;s
                  <span className="text-gray-400 font-normal ml-1">— eerste = voorblad, sleep de volgorde aan</span>
                </label>

                {/* Image grid */}
                {modalImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {modalImages.map((img, i) => (
                      <div key={i} className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${img.isCover ? "border-orange-500" : "border-gray-200"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" className="w-full h-24 object-cover" />

                        {img.isCover && (
                          <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Voorblad</span>
                        )}

                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          {!img.isCover && (
                            <button onClick={() => setCover(i)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded font-semibold w-24">
                              Voorblad
                            </button>
                          )}
                          <div className="flex gap-1">
                            <button onClick={() => moveImage(i, -1)} disabled={i === 0}
                              className="bg-white/90 hover:bg-white text-gray-700 w-7 h-7 rounded flex items-center justify-center disabled:opacity-40">
                              ←
                            </button>
                            <button onClick={() => moveImage(i, 1)} disabled={i === modalImages.length - 1}
                              className="bg-white/90 hover:bg-white text-gray-700 w-7 h-7 rounded flex items-center justify-center disabled:opacity-40">
                              →
                            </button>
                          </div>
                          <button onClick={() => removeModalImage(i)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded w-24">
                            Verwijder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded px-3 py-2.5 hover:border-orange-500 transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    className="text-gray-400 group-hover:text-orange-500 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500 group-hover:text-orange-500">
                    Foto&apos;s toevoegen (meerdere tegelijk mogelijk)
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                    onChange={(e) => e.target.files && addImageFiles(e.target.files)} />
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG of WebP · max. 5 MB per foto</p>
              </div>

              {/* Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Aantal reviews</label>
                  <input type="number" min="0" value={form.reviewCount}
                    onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
              <button onClick={() => setModalOpen(false)}
                className="border border-gray-300 text-gray-700 hover:border-gray-400 text-sm font-medium px-4 py-2 rounded transition-colors">
                Annuleer
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
