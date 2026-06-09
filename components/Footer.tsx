import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white mt-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Auto Garage Tools & Equipment"
              width={200}
              height={90}
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Uw partner in professioneel gereedschap en hoogwaardige uitrusting voor elke garage.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Navigatie
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/producten", label: "Producten" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Informatie
            </p>
            <ul className="space-y-2.5">
              {["Algemene Voorwaarden", "Privacybeleid", "Verzending", "Garantie"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 cursor-pointer hover:text-orange-400 transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Nieuwsbrief
            </p>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Ontvang updates over nieuw gereedschap en exclusieve aanbiedingen.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Uw e-mail"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Autogarage Warre. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-gray-600">
            Industrielaan 42, 2000 Antwerpen
          </p>
        </div>
      </div>
    </footer>
  );
}
