"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/lib/data";
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
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";
import ProductModal from "@/components/admin/ProductModal";
import type { FormState, ModalImage } from "@/components/admin/product-form";
import {
  defaultForm,
  productToForm,
  formToProduct,
  stockLabel,
  stockColor,
} from "@/components/admin/product-form";

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>("overzicht");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();

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
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!adminRow) {
        router.replace("/");
        return;
      }
      setUserEmail(user.email);
      loadProducts();
    });
  }, [router]);

  async function loadProducts() {
    setLoading(true);
    try {
      setProductList(await getAllProducts());
    } catch {
      setErrorMsg("Kon producten niet laden.");
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
      setModalImages(
        existing.map((img, i) => ({ id: img.id, url: img.url, isCover: img.isCover || i === 0 }))
      );
    } else {
      setModalImages(product.image ? [{ url: product.image, isCover: true }] : []);
    }
    setModalOpen(true);
  }

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

  async function handleSave() {
    if (!form.name.trim() || !form.price) {
      setErrorMsg("Naam en prijs zijn verplicht.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const isNew = !editingProduct;
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

      const coverUrl = resolvedImages.find((img) => img.isCover)?.url || resolvedImages[0]?.url || "";
      const productData = formToProduct(form, isNew, coverUrl);

      let savedProduct: Product;
      if (isNew) {
        savedProduct = await createProduct(productData);
        setProductList((prev) => [...prev, savedProduct]);
      } else {
        savedProduct = await updateProduct(editingProduct!.id, productData);
        setProductList((prev) => prev.map((p) => (p.id === editingProduct!.id ? savedProduct : p)));
      }

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

  const filtered = productList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    {
      label: "Totaal producten",
      value: productList.length,
      icon: "📦",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Op voorraad",
      value: productList.filter((p) => p.stock === "op-voorraad").length,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Categorieën",
      value: new Set(productList.map((p) => p.category)).size,
      icon: "🏷",
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Nabestelling",
      value: productList.filter((p) => p.stock === "nabestelling").length,
      icon: "⏳",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
    overzicht: {
      title: "Overzicht",
      subtitle: "Welkom terug! Hier zie je een samenvatting van je webshop.",
    },
    producten: {
      title: "Producten",
      subtitle: "Voeg producten toe, wijzig prijzen of verwijder items uit je assortiment.",
    },
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar
        active={section}
        onNavigate={setSection}
        onLogout={handleLogout}
        userEmail={userEmail}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden shrink-0 rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Menu openen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-lg sm:text-xl truncate">
                {sectionTitles[section].title}
              </h1>
              <p className="text-sm text-gray-500 truncate hidden sm:block">
                {sectionTitles[section].subtitle}
              </p>
            </div>
          </div>

          {section === "producten" && (
            <button
              type="button"
              onClick={openNew}
              className="shrink-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Nieuw product</span>
              <span className="sm:hidden">Nieuw</span>
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-8">
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-600 ml-4 font-bold">
                ✕
              </button>
            </div>
          )}

          {/* ─── Overzicht ─── */}
          {section === "overzicht" && (
            <div className="space-y-8 max-w-5xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-3 ${color}`}>
                      {icon}
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-navy">{loading ? "—" : value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Snel aan de slag</h2>
                <p className="text-sm text-gray-500 mb-6">Drie stappen om je webshop te beheren.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      step: "1",
                      title: "Product toevoegen",
                      text: "Klik op Producten en voeg een nieuw item toe met foto's en prijs.",
                      action: () => {
                        setSection("producten");
                        openNew();
                      },
                      label: "Product toevoegen",
                    },
                    {
                      step: "2",
                      title: "Prijzen bijwerken",
                      text: "Zoek een product en klik op Bewerken om de prijs of voorraad aan te passen.",
                      action: () => setSection("producten"),
                      label: "Naar producten",
                    },
                    {
                      step: "3",
                      title: "Webshop bekijken",
                      text: "Controleer hoe alles eruitziet voor je klanten.",
                      action: () => window.open("/", "_blank"),
                      label: "Webshop openen",
                    },
                  ].map((item) => (
                    <div key={item.step} className="rounded-xl bg-surface border border-gray-100 p-5 flex flex-col">
                      <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-navy text-white text-sm font-bold mb-3">
                        {item.step}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 flex-1 mb-4">{item.text}</p>
                      <button
                        type="button"
                        onClick={item.action}
                        className="text-sm font-semibold text-orange-500 hover:text-orange-600 text-left"
                      >
                        {item.label} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy rounded-2xl p-6 text-white">
                <h2 className="font-bold text-lg mb-2">Recente producten</h2>
                <p className="text-white/60 text-sm mb-4">Je laatst toegevoegde items in het assortiment.</p>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 bg-white/10 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : productList.length === 0 ? (
                  <p className="text-white/50 text-sm">Nog geen producten. Voeg je eerste product toe!</p>
                ) : (
                  <ul className="space-y-2">
                    {productList.slice(-5).reverse().map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-3 bg-white/10 rounded-xl px-4 py-3"
                      >
                        <span className="font-medium text-sm truncate">{p.name}</span>
                        <span className="text-orange-400 font-semibold text-sm shrink-0">
                          € {p.price.toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => setSection("producten")}
                  className="mt-4 text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  Alle producten bekijken →
                </button>
              </div>
            </div>
          )}

          {/* ─── Producten ─── */}
          {section === "producten" && (
            <div className="max-w-6xl">
              <div className="mb-6">
                <div className="relative max-w-md">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Zoek op productnaam..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-48 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    📦
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Geen producten gevonden</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {search ? "Probeer een andere zoekterm." : "Voeg je eerste product toe om te beginnen."}
                  </p>
                  {!search && (
                    <button type="button" onClick={openNew} className="btn-primary text-sm">
                      + Eerste product toevoegen
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((product) => (
                    <article
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-40 bg-gray-50">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">📦</div>
                        )}
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${stockColor[product.stock]}`}
                        >
                          {stockLabel[product.stock]}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs text-gray-400 font-medium mb-1">{product.category}</p>
                        <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-xl font-bold text-navy mb-4">
                          € {product.price.toFixed(2).replace(".", ",")}
                        </p>

                        <div className="mt-auto flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            className="flex-1 bg-navy hover:bg-navy-light text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                          >
                            Bewerken
                          </button>
                          <Link
                            href={`/producten/${product.id}`}
                            target="_blank"
                            className="px-3 py-2 border border-gray-200 rounded-xl text-gray-500 hover:text-navy hover:border-navy text-sm transition-colors"
                            title="Bekijk op webshop"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          {deleteId === product.id ? (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl"
                              >
                                Ja
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteId(null)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-500"
                              >
                                Nee
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteId(product.id)}
                              className="px-3 py-2 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 text-sm transition-colors"
                              title="Verwijderen"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ProductModal
        open={modalOpen}
        editingProduct={editingProduct}
        form={form}
        setForm={setForm}
        modalImages={modalImages}
        saving={saving}
        errorMsg={errorMsg}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        addImageFiles={addImageFiles}
        removeModalImage={removeModalImage}
        moveImage={moveImage}
        setCover={setCover}
        setSpecRow={setSpecRow}
      />
    </div>
  );
}
