import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts, getProductImages } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "@/components/ImageGallery";
import ReviewSection from "@/components/ReviewSection";
import type { StockStatus } from "@/lib/data";

export const dynamic = "force-dynamic";

const stockLabels: Record<StockStatus, { label: string; color: string }> = {
  "op-voorraad": { label: "Op voorraad", color: "bg-emerald-500" },
  "laatste-items": { label: "Laatste items", color: "bg-orange-500" },
  nabestelling: { label: "Nabestelling", color: "bg-gray-500" },
  populair: { label: "Populair", color: "bg-red-500" },
};

interface Props {
  params: Promise<{ id: string }>;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex text-orange-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, productImages] = await Promise.all([
    getRelatedProducts(product.category, product.id),
    getProductImages(product.id),
  ]);

  const images = productImages.length > 0
    ? productImages.map((img) => img.url)
    : [product.image];

  const stars = Math.round(product.rating);
  const stock = stockLabels[product.stock];

  return (
    <div className="bg-[#f4f6f9] min-h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/producten" className="hover:text-orange-500 transition-colors">Producten</Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/producten?categorie=${encodeURIComponent(product.category)}`}
              className="hover:text-orange-500 transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-navy font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
              <ImageGallery
                images={images}
                alt={product.name}
                stockLabel={stock.label}
                stockColor={stock.color}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Link
              href={`/producten?categorie=${encodeURIComponent(product.category)}`}
              className="inline-flex self-start text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 hover:text-orange-600 transition-colors"
            >
              {product.category}
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <StarRow rating={stars} />
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} · {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-navy rounded-2xl p-6 mb-6 text-white">
              <p className="text-sm text-gray-400 mb-1">Adviesprijs</p>
              <p className="text-4xl font-bold tracking-tight">
                € {product.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Excl. BTW: € {product.priceExVAT.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-[15px] mb-6">
              {product.description}
            </p>

            {product.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Kenmerken
                </p>
                <ul className="space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <Link href="/contact" className="btn-primary w-full text-base py-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Vraag offerte aan
              </Link>
              <button className="btn-outline w-full py-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download specificaties (PDF)
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pro-kwaliteit", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { label: "Snelle levering", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { label: "Expert advies", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              ].map(({ label, icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-xl border border-gray-200/80 p-3 text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500 mx-auto mb-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                  <p className="text-[11px] font-medium text-gray-600 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & specs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy">Gedetailleerde beschrijving</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {product.longDescription || product.description}
            </p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy">Specificaties</h2>
            </div>
            <dl className="space-y-0 divide-y divide-gray-100">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4 py-3.5 text-sm">
                  <dt className="text-gray-500 font-medium">{key}</dt>
                  <dd className="text-navy font-semibold text-right">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="section-eyebrow">Gerelateerd</p>
                <h2 className="section-title">Andere producten in {product.category}</h2>
              </div>
              <Link
                href={`/producten?categorie=${encodeURIComponent(product.category)}`}
                className="text-sm font-medium text-navy hover:text-orange-500 transition-colors shrink-0"
              >
                Bekijk categorie →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="featured" />
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm">
          <ReviewSection productId={product.id} />
        </section>
      </div>
    </div>
  );
}
