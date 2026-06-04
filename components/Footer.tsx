import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <p className="font-bold text-lg text-navy mb-2">Autogarage Warre</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Uw partner in professioneel gereedschap en hoogwaardige voertuigzorg.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Navigatie
            </p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/producten", label: "Producten" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Informatie
            </p>
            <ul className="space-y-2">
              {[
                "Algemene Voorwaarden",
                "Privacybeleid",
                "Verzending",
                "Garantie",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 cursor-pointer hover:text-orange-500 transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Nieuwsbrief
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Ontvang de nieuwste updates over professioneel gereedschap.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Uw e-mail"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500"
              />
              <button className="bg-navy text-white px-3 py-2 rounded text-sm font-medium hover:bg-navy-light transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-xs text-gray-400">
            © 2024 Autogarage Warre. Uw partner in professioneel gereedschap.
          </p>
        </div>
      </div>
    </footer>
  );
}
