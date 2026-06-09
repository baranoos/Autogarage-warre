/** Product- en categorie-afbeeldingen (lokaal in /public/products) */

const P = "/products";

/** Vaste productfoto's gekoppeld aan product-id */
export const productImages: Record<string, string> = {
  "momentsleutel-pro-series": `${P}/momentsleutel-pro-series.png`,
  "momentsleutel-digitaal": `${P}/momentsleutel-digitaal.png`,
  "dopsleutelset-120-delig": `${P}/dopsleutelset-120-delig.png`,
  "gereedschapswagen-7-laden": `${P}/gereedschapswagen-7-laden.png`,
  "hydraulische-hefbrug-4t": `${P}/hydraulische-hefbrug-4t.png`,
  "hydraulische-krik-3t": `${P}/hydraulische-krik-3t.png`,
  "master-mechanic-kit": `${P}/master-mechanic-kit.png`,
  "obdii-master-scanner": `${P}/obdii-master-scanner.png`,
  "schroevendraaier-set": `${P}/schroevendraaier-set.png`,
  "pro-series-slagmoersleutel": `${P}/pro-series-slagmoersleutel.png`,
  "silent-compressor-50l": `${P}/silent-compressor-50l.png`,
  "slagmoersleutel-18v-xr": `${P}/slagmoersleutel-18v-xr.png`,
  "led-werklamp": `${P}/led-werklamp.png`,
};

export const categoryImages: Record<string, string> = {
  Handgereedschap: `${P}/category-handgereedschap.png`,
  Elektrisch: `${P}/slagmoersleutel-18v-xr.png`,
  Pneumatisch: `${P}/silent-compressor-50l.png`,
  Diagnostiek: `${P}/obdii-master-scanner.png`,
  Sets: `${P}/dopsleutelset-120-delig.png`,
  Hefgereedschap: `${P}/hydraulische-krik-3t.png`,
  Verlichting: `${P}/led-werklamp.png`,
  Garage: `${P}/gereedschapswagen-7-laden.png`,
  Garagebenodigdheden: `${P}/category-garage.png`,
};

export const siteImages = {
  hero: `${P}/category-garage.png`,
  heroSide: `${P}/obdii-master-scanner.png`,
  contact: `${P}/category-garage.png`,
  producten: `${P}/category-handgereedschap.png`,
  cta: `${P}/gereedschapswagen-7-laden.png`,
  showroom: `${P}/category-garage.png`,
} as const;

export const galleryImages = [
  { src: `${P}/dopsleutelset-120-delig.png`, alt: "Dopsleutelset 120-delig" },
  { src: `${P}/momentsleutel-pro-series.png`, alt: "Momentsleutel Pro-Series" },
  { src: `${P}/category-garage.png`, alt: "Professionele garage" },
  { src: `${P}/hydraulische-krik-3t.png`, alt: "Hydraulische krik" },
  { src: `${P}/master-mechanic-kit.png`, alt: "Master Mechanic Kit" },
  { src: `${P}/obdii-master-scanner.png`, alt: "OBDII diagnose scanner" },
];

export function getCategoryImage(category: string): string {
  return categoryImages[category] ?? `${P}/category-handgereedschap.png`;
}

/** Altijd lokale productfoto; negeert kapotte DB-paden en stockfoto-URL's. */
export function resolveProductImage(
  _image: string,
  category: string,
  productId: string
): string {
  return productImages[productId] ?? getCategoryImage(category);
}
