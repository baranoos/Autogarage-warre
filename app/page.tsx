import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import { siteImages, categoryImages, galleryImages } from "@/lib/images";

export const dynamic = "force-dynamic";

const categoryBlocks = [
  {
    name: "Handgereedschap",
    subtitle: "Sleutels, doppen en tangen van topkwaliteit",
    image: categoryImages.Handgereedschap,
  },
  {
    name: "Elektrisch",
    subtitle: "Krachtig & draadloos",
    image: categoryImages.Elektrisch,
  },
  {
    name: "Garage",
    subtitle: "Lifts, krikken en meetapparatuur",
    image: categoryImages.Garage,
  },
];

const stats = [
  { value: "500+", label: "Producten" },
  { value: "15+", label: "Jaar ervaring" },
  { value: "2.000+", label: "Tevreden klanten" },
  { value: "24u", label: "Snelle levering" },
];

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-navy">
        <Image
          src={siteImages.hero}
          alt="Professionele autogarage"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#f4f6f9] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <p className="animate-fade-up text-orange-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                Auto Garage Tools & Equipment
              </p>
              <h1 className="animate-fade-up-delay-1 text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Professioneel gereedschap voor elke garage
              </h1>
              <p className="animate-fade-up-delay-2 text-gray-300 mt-6 text-lg leading-relaxed max-w-lg">
                Ontworpen voor precisie en duurzaamheid. Het assortiment waar monteurs,
                garages en autoliefhebbers op vertrouwen.
              </p>
              <div className="animate-fade-up-delay-3 flex gap-4 mt-10 flex-wrap">
                <Link href="/producten" className="btn-primary">
                  Bekijk producten
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Neem contact op
                </Link>
              </div>
            </div>

            <div className="hidden lg:block animate-fade-up-delay-2">
              <div className="relative h-80 rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/40">
                <Image
                  src={siteImages.heroSide}
                  alt="Monteur aan het werk"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-semibold text-sm">Showroom Antwerpen</p>
                  <p className="text-gray-300 text-xs mt-0.5">Kom langs voor persoonlijk advies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative -mt-20 z-10 max-w-5xl mx-auto px-6">
        <div className="card grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 overflow-hidden shadow-lg">
          {stats.map(({ value, label }) => (
            <div key={label} className="px-6 py-6 text-center bg-white">
              <p className="text-2xl md:text-3xl font-bold text-navy">{value}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Assortiment</p>
          <h2 className="section-title">Shop per categorie</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            Vind snel het juiste gereedschap voor uw werkplaats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categoryBlocks.map((cat) => (
            <Link
              key={cat.name}
              href={`/producten?categorie=${encodeURIComponent(cat.name)}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent group-hover:via-navy/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{cat.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-orange-400 text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Bekijk categorie
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Photo gallery */}
      <section className="bg-navy py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Onze wereld</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Werkplaats & showroom</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <div
              key={img.alt}
              className={`relative rounded-xl overflow-hidden ${
                i === 0 ? "col-span-2 row-span-2 h-64 md:h-80" : "h-36 md:h-44"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-navy/20 hover:bg-navy/0 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[#f4f6f9] pattern-grid py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="section-eyebrow">Uitgelicht</p>
              <h2 className="section-title">Populaire producten</h2>
            </div>
            <Link
              href="/producten"
              className="text-sm text-navy hover:text-orange-500 transition-colors flex items-center gap-1 font-medium shrink-0"
            >
              Bekijk assortiment
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 overflow-hidden">
        <Image
          src={siteImages.showroom}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/88" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              Waarom wij
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Gebouwd voor professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Betrouwbare kwaliteit",
                text: "Enkel gereedschap dat voldoet aan de hoogste industriestandaarden voor professioneel gebruik.",
              },
              {
                title: "Persoonlijk advies",
                text: "Onze experts helpen u bij de juiste gereedschapskeuze voor uw specifieke behoeften.",
              },
              {
                title: "Voor elke werkplaats",
                text: "Van zelfstandige monteur tot grote garagebedrijven — wij hebben de juiste uitrusting.",
              },
            ].map(({ title, text }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-8 text-center hover:bg-white/15 transition-colors"
              >
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden min-h-[280px] flex items-center">
          <Image
            src={siteImages.cta}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Klaar om uw garage te professionaliseren?
              </h2>
              <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                Neem contact op voor een offerte op maat of bezoek onze showroom voor een
                persoonlijke demonstratie.
              </p>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap justify-center">
              <Link href="/contact" className="btn-primary">
                Contacteer ons
              </Link>
              <a href="tel:+3203123456" className="btn-secondary">
                Bel direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
