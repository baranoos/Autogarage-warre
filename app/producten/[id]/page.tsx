import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts, getProductImages } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "@/components/ImageGallery";
import ReviewSection from "@/components/ReviewSection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span>›</span>
          <Link href="/producten" className="hover:text-orange-500">Producten</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <ImageGallery images={images} alt={product.name} />

          {/* Info */}
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
              Premium Tools
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24"
                    fill={i < stars ? "currentColor" : "none"}
                    stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-1">
              € {product.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-sm text-gray-500 mb-5">
              Exclusief BTW: € {product.priceExVAT.toFixed(2).replace(".", ",")}
            </p>

            <p className="text-gray-600 leading-relaxed mb-5">{product.description}</p>

            <ul className="space-y-2 mb-6">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                    className="text-orange-500 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Link href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact over dit product
              </Link>
              <button className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-500 text-gray-700 font-semibold py-3 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Specificaties (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Description + specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 border-t border-gray-100 pt-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gedetailleerde beschrijving</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Technische details</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-500 font-medium w-1/2">{key}</td>
                    <td className="py-2 text-gray-900">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 pt-10 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gerelateerde producten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="featured" />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
