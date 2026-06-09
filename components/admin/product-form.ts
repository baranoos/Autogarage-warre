"use client";

import { type Product, type StockStatus } from "@/lib/data";

export type SpecRow = { key: string; value: string };

export type ModalImage = {
  id?: string;
  url: string;
  file?: File;
  isCover: boolean;
};

export type FormState = {
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

export const defaultForm: FormState = {
  id: "",
  name: "",
  category: "Handgereedschap",
  price: "",
  priceExVAT: "",
  description: "",
  longDescription: "",
  featuresText: "",
  stock: "op-voorraad",
  rating: "4.5",
  reviewCount: "0",
  specs: [{ key: "", value: "" }],
};

export function productToForm(p: Product): FormState {
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
    rating: p.rating.toString(),
    reviewCount: p.reviewCount.toString(),
    specs:
      Object.entries(p.specs).length > 0
        ? Object.entries(p.specs).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }],
  };
}

export function formToProduct(form: FormState, isNew: boolean, coverUrl: string): Product {
  const price = parseFloat(form.price) || 0;
  const id = isNew
    ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : form.id;
  return {
    id,
    name: form.name,
    category: form.category,
    price,
    priceExVAT: parseFloat(form.priceExVAT) || parseFloat((price / 1.21).toFixed(2)),
    description: form.description,
    longDescription: form.longDescription,
    features: form.featuresText.split("\n").filter((f) => f.trim()),
    stock: form.stock,
    image: coverUrl || `https://picsum.photos/seed/${id || "product"}/800/600`,
    rating: parseFloat(form.rating) || 4.5,
    reviewCount: parseInt(form.reviewCount) || 0,
    specs: Object.fromEntries(
      form.specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()])
    ),
  };
}

export const stockLabel: Record<StockStatus, string> = {
  "op-voorraad": "Op voorraad",
  "laatste-items": "Laatste items",
  populair: "Populair",
  nabestelling: "Nabestelling",
};

export const stockColor: Record<StockStatus, string> = {
  "op-voorraad": "bg-emerald-100 text-emerald-700",
  "laatste-items": "bg-amber-100 text-amber-700",
  populair: "bg-rose-100 text-rose-700",
  nabestelling: "bg-gray-100 text-gray-600",
};
