import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";

const stockLabels: Record<string, { label: string; color: string }> = {
  "op-voorraad": { label: "Op voorraad", color: "bg-emerald-500" },
  "laatste-items": { label: "Laatste items", color: "bg-orange-500" },
  nabestelling: { label: "Nabestelling", color: "bg-gray-500" },
  populair: { label: "Populair", color: "bg-red-500" },
};

interface Props {
  product: Product;
  variant?: "grid" | "featured";
}

export default function ProductCard({ product, variant = "grid" }: Props) {
  const badge = stockLabels[product.stock];

  if (variant === "featured") {
    return (
      <div className="card-hover group overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="relative h-56 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <span
            className={`absolute top-3 right-3 ${badge.color} text-white text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide`}
          >
            {product.stock === "op-voorraad"
              ? "In voorraad"
              : product.stock === "nabestelling"
              ? "Bestelling"
              : badge.label.toUpperCase()}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1.5">
            {product.category}
          </p>
          <Link href={`/producten/${product.id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-navy font-bold text-lg">
              € {product.price.toFixed(2).replace(".", ",")}
            </span>
            <Link
              href={`/producten/${product.id}`}
              className="bg-navy hover:bg-navy-light text-white p-2.5 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-navy/8 hover:-translate-y-1 hover:border-gray-300">
      <Link href={`/producten/${product.id}`} className="block relative h-48 bg-[#eef1f5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 left-3 ${badge.color} text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
          {badge.label}
        </span>
      </Link>
      <div className="p-5">
        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wider mb-1.5">
          {product.category}
        </p>
        <Link href={`/producten/${product.id}`}>
          <h3 className="font-semibold text-navy group-hover:text-orange-500 transition-colors text-[15px] leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <p className="font-bold text-navy text-xl">
            €{product.price.toFixed(2).replace(".", ",")}
          </p>
          <Link
            href={`/producten/${product.id}`}
            className="shrink-0 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Bekijk
          </Link>
        </div>
      </div>
    </div>
  );
}
