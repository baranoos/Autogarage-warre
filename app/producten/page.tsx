"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categories, type Product } from "@/lib/data";
import { getAllProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { siteImages } from "@/lib/images";

const PRICE_MAX = 5000;

const sortOptions = [
  { value: "populairst", label: "Populairst" },
  { value: "prijs-laag", label: "Prijs: laag → hoog" },
  { value: "prijs-hoog", label: "Prijs: hoog → laag" },
  { value: "naam", label: "Naam A → Z" },
];

function ProductenContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categorie") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>(
    initialCat ? [initialCat] : []
  );
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [stockFilter, setStockFilter] = useState("alle");
  const [sortBy, setSortBy] = useState("populairst");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const PER_PAGE = 9;

  useEffect(() => {
    getAllProducts().then((data) => {
      setAllProducts(data);
      setLoadingProducts(false);
    });
  }, []);

  const hasActiveFilters =
    search !== "" ||
    selectedCats.length > 0 ||
    priceMin > 0 ||
    priceMax < PRICE_MAX ||
    stockFilter !== "alle";

  function toggleCat(cat: string) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSelectedCats([]);
    setPriceMin(0);
    setPriceMax(PRICE_MAX);
    setStockFilter("alle");
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.length > 0 && !selectedCats.includes(p.category)) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      if (stockFilter === "op-voorraad" && p.stock !== "op-voorraad") return false;
      return true;
    });

    if (sortBy === "prijs-laag") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "prijs-hoog") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "naam") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [allProducts, search, selectedCats, priceMin, priceMax, stockFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFilterTags = [
    ...selectedCats.map((cat) => ({ key: `cat-${cat}`, label: cat, clear: () => toggleCat(cat) })),
    ...(priceMin > 0 || priceMax < PRICE_MAX
      ? [{ key: "price", label: `€${priceMin} – €${priceMax}`, clear: () => { setPriceMin(0); setPriceMax(PRICE_MAX); setPage(1); } }]
      : []),
    ...(stockFilter === "op-voorraad"
      ? [{ key: "stock", label: "Op voorraad", clear: () => { setStockFilter("alle"); setPage(1); } }]
      : []),
    ...(search
      ? [{ key: "search", label: `"${search}"`, clear: () => { setSearch(""); setPage(1); } }]
      : []),
  ];

  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      <PageHeader
        eyebrow="Assortiment"
        title="Ons gereedschap"
        subtitle="Professionele uitrusting voor de veeleisende monteur. Filter op categorie, prijs of voorraad."
        image={siteImages.producten}
      />

      {/* Category quick-filter bar */}
      <div className="bg-white border-b border-gray-200/80 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => { setSelectedCats([]); setPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCats.length === 0
                  ? "bg-navy text-white shadow-md shadow-navy/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Alles
            </button>
            {categories.map((cat) => {
              const active = selectedCats.includes(cat);
              const count = allProducts.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-navy"
                  }`}
                >
                  {cat}
                  {!loadingProducts && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/25" : "bg-white text-gray-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-navy text-lg">{filtered.length}</span>
              <span className="ml-1">product{filtered.length !== 1 ? "en" : ""}</span>
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
              >
                Filters wissen
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:min-w-[260px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Zoek op productnaam..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-shadow"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilterTags.map((tag) => (
              <button
                key={tag.key}
                onClick={tag.clear}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-navy text-xs font-medium px-3 py-1.5 rounded-full hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                {tag.label}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-full lg:w-72 shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sticky top-44 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-navy text-sm uppercase tracking-wider">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                    Wissen
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorie</p>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const checked = selectedCats.includes(cat);
                    return (
                      <label
                        key={cat}
                        className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                          checked ? "bg-orange-50 border border-orange-200" : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCat(cat)}
                          className="accent-orange-500 w-4 h-4 rounded"
                        />
                        <span className={`text-sm flex-1 ${checked ? "text-navy font-medium" : "text-gray-600"}`}>
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Prijsbereik</p>
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 text-center">
                  <span className="text-navy font-bold text-lg">
                    €{priceMin.toLocaleString("nl-BE")} – €{priceMax.toLocaleString("nl-BE")}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX}
                  step={50}
                  value={priceMax}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPriceMax(v);
                    if (v < priceMin) setPriceMin(v);
                    setPage(1);
                  }}
                  className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-orange-500 cursor-pointer mb-4"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                      <input
                        type="number"
                        min={0}
                        max={priceMax}
                        value={priceMin}
                        onChange={(e) => {
                          const v = Math.min(Number(e.target.value), priceMax);
                          setPriceMin(v < 0 ? 0 : v);
                          setPage(1);
                        }}
                        className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Maximum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                      <input
                        type="number"
                        min={priceMin}
                        max={PRICE_MAX}
                        value={priceMax}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setPriceMax(v > PRICE_MAX ? PRICE_MAX : v < priceMin ? priceMin : v);
                          setPage(1);
                        }}
                        className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Voorraad</p>
                <div className="space-y-2">
                  {[
                    { value: "alle", label: "Alle producten" },
                    { value: "op-voorraad", label: "Alleen op voorraad" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition-colors ${
                        stockFilter === value ? "bg-navy/5 border border-navy/20" : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="stock"
                        checked={stockFilter === value}
                        onChange={() => { setStockFilter(value); setPage(1); }}
                        className="accent-navy w-4 h-4"
                      />
                      <span className={`text-sm ${stockFilter === value ? "text-navy font-medium" : "text-gray-600"}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-4/5" />
                      <div className="h-6 bg-gray-100 rounded w-1/4" />
                      <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 py-20 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">Geen producten gevonden</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Pas je filters aan of probeer een andere zoekterm.
                </p>
                <button onClick={clearFilters} className="btn-primary text-sm">
                  Alle filters wissen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} variant="grid" />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-navy hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                      p === page
                        ? "bg-navy text-white shadow-md shadow-navy/20"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-navy hover:text-navy"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-navy hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      <PageHeader eyebrow="Assortiment" title="Ons gereedschap" subtitle="Laden..." />
      <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function ProductenPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductenContent />
    </Suspense>
  );
}
