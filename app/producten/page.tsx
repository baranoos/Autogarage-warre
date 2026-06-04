"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categories, type Product } from "@/lib/data";
import { getAllProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

const PRICE_MAX = 5000;

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

  const PER_PAGE = 8;

  useEffect(() => {
    getAllProducts().then((data) => {
      setAllProducts(data);
      setLoadingProducts(false);
    });
  }, []);

  function toggleCat(cat: string) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
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

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ons gereedschap</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Professionele uitrusting voor de veeleisende monteur. Onze selectie gereedschap is
              getest in de zwaarste werkplaatscondities.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Zoek naar gereedschap..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter panel */}
          <aside className="w-48 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-20">
              <p className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-4">
                Filters
              </p>

              <p className="text-xs font-semibold text-gray-600 mb-2">Categorie</p>
              <div className="space-y-1.5 mb-5">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                      className="accent-orange-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-600 mb-2">Prijsbereik (€)</p>
              <input
                type="range"
                min={0}
                max={PRICE_MAX}
                value={priceMax}
                onChange={(e) => { const v = Number(e.target.value); setPriceMax(v); if (v < priceMin) setPriceMin(v); setPage(1); }}
                className="w-full accent-orange-500 mb-3"
              />
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-0.5 block">Min</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                    <input
                      type="number"
                      min={0}
                      max={priceMax}
                      value={priceMin}
                      onChange={(e) => { const v = Math.min(Number(e.target.value), priceMax); setPriceMin(v < 0 ? 0 : v); setPage(1); }}
                      className="w-full pl-5 pr-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-4">–</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-0.5 block">Max</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                    <input
                      type="number"
                      min={priceMin}
                      max={PRICE_MAX}
                      value={priceMax}
                      onChange={(e) => { const v = Number(e.target.value); setPriceMax(v > PRICE_MAX ? PRICE_MAX : v < priceMin ? priceMin : v); setPage(1); }}
                      className="w-full pl-5 pr-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-600 mb-2">Voorraadstatus</p>
              <select
                value={stockFilter}
                onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-orange-500"
              >
                <option value="alle">Alle producten</option>
                <option value="op-voorraad">Op voorraad</option>
              </select>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filtered.length}</span> Resultaten
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sorteer op:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="populairst">Populairst</option>
                  <option value="prijs-laag">Prijs: laag–hoog</option>
                  <option value="prijs-hoog">Prijs: hoog–laag</option>
                  <option value="naam">Naam A–Z</option>
                </select>
              </div>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Geen producten gevonden voor deze filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} variant="grid" />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center border rounded text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-orange-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
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

export default function ProductenPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64 text-gray-400">Laden...</div>}>
      <ProductenContent />
    </Suspense>
  );
}
