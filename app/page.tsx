import Link from "next/link";
import { getAllProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const categoryBlocks = [
  {
    name: "Handgereedschap",
    subtitle: "Sleutels, doppen en tangen van topkwaliteit",
    gradient:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), linear-gradient(135deg, #0d1b30 0%, #1a2e4a 100%)",
  },
  {
    name: "Elektrisch",
    subtitle: "Krachtig & draadloos",
    gradient:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), linear-gradient(135deg, #0a1525 0%, #152236 100%)",
  },
  {
    name: "Garagebenodigdheden",
    subtitle: "Lifts, krikken en meetapparatuur",
    gradient:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), linear-gradient(135deg, #0f1e35 0%, #1c2f4a 100%)",
  },
];

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-125 flex items-center"
        style={{
          background:
            "linear-gradient(rgba(0,5,20,0.6), rgba(0,10,30,0.75)), linear-gradient(135deg, #0a0f1e 0%, #0d1b3a 50%, #091525 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
            Professioneel gereedschap
            <br />
            voor elke garage
          </h1>
          <p className="text-gray-300 mt-4 max-w-md leading-relaxed">
            Bekijk ons assortiment gereedschappen voor monteurs, garages en autoliefhebbers.
            Ontworpen voor precisie en duurzaamheid.
          </p>
          <div className="flex gap-4 mt-8 flex-wrap">
            <Link
              href="/producten"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Bekijk producten
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-navy font-semibold px-6 py-3 rounded transition-colors"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>

      {/* Category blocks */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {categoryBlocks.slice(0, 2).map((cat) => (
            <Link
              key={cat.name}
              href={`/producten?categorie=${encodeURIComponent(cat.name)}`}
              className="relative h-52 rounded-lg overflow-hidden group"
              style={{ background: cat.gradient }}
            >
              <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href={`/producten?categorie=Garagebenodigdheden`}
          className="relative h-40 rounded-lg overflow-hidden block group"
          style={{ background: categoryBlocks[2].gradient }}
        >
          <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h3 className="text-white font-bold text-xl">{categoryBlocks[2].name}</h3>
            <p className="text-gray-300 text-sm mt-1">{categoryBlocks[2].subtitle}</p>
          </div>
        </Link>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">
              Uitgelicht
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Populaire Producten</h2>
          </div>
          <Link
            href="/producten"
            className="text-sm text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
          >
            Bekijk assortiment
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="featured" />
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto text-orange-500 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Betrouwbare kwaliteit",
                text: "Wij selecteren enkel het beste gereedschap dat voldoet aan de hoogste industriestandaarden voor professioneel gebruik.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto text-orange-500 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                ),
                title: "Eenvoudig contact",
                text: "Persoonlijk advies nodig? Onze experts staan voor u klaar om u te helpen bij de juiste gereedschapskeuze.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto text-orange-500 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Voor professionals",
                text: "Gespecialiseerd in uitrusting voor zowel zelfstandige monteurs als grote garagebedrijven en autoliefhebbers.",
              },
            ].map(({ icon, title, text }) => (
              <div key={title}>
                {icon}
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#F5F5F5] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Klaar om uw garage te professionaliseren?
            </h2>
            <p className="text-gray-500 text-sm">
              Neem contact op voor een offerte op maat of bezoek onze showroom voor een persoonlijke
              demonstratie.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/contact"
              className="bg-navy hover:bg-navy-light text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap"
            >
              Contacteer ons
            </Link>
            <a
              href="tel:+3203123456"
              className="border border-gray-300 text-gray-700 hover:border-gray-500 font-semibold px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap"
            >
              Bel direct
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
