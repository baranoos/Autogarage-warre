"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-16 h-16 rounded border-2 overflow-hidden bg-gray-100 relative shrink-0 transition-colors ${
              i === active ? "border-orange-500" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" unoptimized />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 rounded-lg overflow-hidden bg-gray-100 min-h-80 group">
        <Image
          src={images[active]}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-200"
          unoptimized
          priority
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Direct leverbaar
        </span>
      </div>
    </div>
  );
}
