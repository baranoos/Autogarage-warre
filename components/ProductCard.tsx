import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";

const stockLabels: Record<string, { label: string; color: string }> = {
  "op-voorraad": { label: "Op voorraad", color: "bg-green-500" },
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
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="relative h-52 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span
            className={`absolute top-3 right-3 ${badge.color} text-white text-xs font-semibold px-2 py-1 rounded uppercase`}
          >
            {product.stock === "op-voorraad"
              ? "In voorraad"
              : product.stock === "nabestelling"
              ? "Bestelling"
              : badge.label.toUpperCase()}
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <Link href={`/producten/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-800 font-medium">
              € {product.price.toFixed(2).replace(".", ",")}
            </span>
            <Link
              href={`/producten/${product.id}`}
              className="bg-navy text-white p-2 rounded hover:bg-navy-light transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
        <span
          className={`absolute top-2 left-2 ${badge.color} text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
          {badge.label}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-orange-500 mb-1">{product.category}</p>
        <Link href={`/producten/${product.id}`}>
          <h3 className="font-semibold text-navy hover:text-orange-500 transition-colors text-sm leading-snug mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="font-bold text-gray-900 text-lg mb-3">
          €{product.price.toFixed(2).replace(".", ",")}
        </p>
        <Link
          href={`/producten/${product.id}`}
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded transition-colors"
        >
          Bekijk details
        </Link>
      </div>
    </div>
  );
}
