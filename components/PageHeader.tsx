import Image from "next/image";

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image?: string;
}

export default function PageHeader({ title, subtitle, eyebrow, image }: Props) {
  return (
    <section className="relative bg-navy overflow-hidden min-h-[200px]">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
        </>
      )}
      <div className="absolute inset-0 pattern-dots opacity-40" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
        {eyebrow && (
          <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-gray-300 mt-3 max-w-2xl leading-relaxed text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
    </section>
  );
}
