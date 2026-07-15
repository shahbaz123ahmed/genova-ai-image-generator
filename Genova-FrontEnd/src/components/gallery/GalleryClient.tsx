"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiImage,
  FiZap,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

const CATEGORIES = [
  "All",
  "Photorealistic",
  "Cyberpunk",
  "Anime",
  "Fantasy",
  "Abstract",
] as const;

type Category = (typeof CATEGORIES)[number];

type GalleryImage = {
  id: number;
  url: string;
  title: string;
  prompt: string;
  description: string;
  category: Exclude<Category, "All">;
  aspectRatio: string;
  width: number;
  height: number;
};

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop",
    title: "Futuristic Cyberpunk City",
    prompt:
      "A futuristic cyberpunk city at night with neon lights reflecting in puddles, cinematic atmosphere, highly detailed.",
    description:
      "A neon-lit futuristic city scene created in a cinematic cyberpunk style.",
    category: "Cyberpunk",
    aspectRatio: "aspect-[4/5]",
    width: 960,
    height: 1200,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
    title: "Neon Abstract Fluid Art",
    prompt:
      "Abstract fluid art with vibrant gradients of neon green and cyber blue, smooth flowing shapes, ultra-detailed, 8K.",
    description:
      "Vibrant abstract artwork featuring flowing neon green and blue gradients.",
    category: "Abstract",
    aspectRatio: "aspect-square",
    width: 1200,
    height: 1200,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop",
    title: "Mystical Fantasy Forest",
    prompt:
      "A mystical fantasy forest with glowing mushrooms, ancient trees and a magical blue aura, detailed digital painting.",
    description:
      "An enchanted fantasy environment filled with glowing plants and magical light.",
    category: "Fantasy",
    aspectRatio: "aspect-[3/4]",
    width: 900,
    height: 1200,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    title: "Astronaut Exploring Mars",
    prompt:
      "Hyper-realistic portrait of an astronaut standing on Mars and looking toward Earth, dramatic cinematic lighting.",
    description:
      "A photorealistic space exploration concept showing an astronaut on Mars.",
    category: "Photorealistic",
    aspectRatio: "aspect-video",
    width: 1200,
    height: 675,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
    title: "Anime Reading by the Window",
    prompt:
      "Beautiful anime-style illustration of a girl reading a book beside a window on a rainy evening, warm ambient lighting.",
    description:
      "A peaceful anime-inspired reading scene with rain and warm interior lighting.",
    category: "Anime",
    aspectRatio: "aspect-[4/5]",
    width: 960,
    height: 1200,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1200&auto=format&fit=crop",
    title: "Flying Car in a Future City",
    prompt:
      "A flying car passing futuristic skyscrapers in a dystopian cyberpunk city, volumetric lighting and cinematic perspective.",
    description:
      "A dramatic cyberpunk transportation concept set among futuristic skyscrapers.",
    category: "Cyberpunk",
    aspectRatio: "aspect-square",
    width: 1200,
    height: 1200,
  },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") {
      return GALLERY_IMAGES;
    }

    return GALLERY_IMAGES.filter(
      (image) => image.category === activeCategory
    );
  }, [activeCategory]);

  const handleCopy = async (id: number, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId((currentId) => (currentId === id ? null : currentId));
      }, 2000);
    } catch (error) {
      console.error("Unable to copy the AI image prompt:", error);
    }
  };

  return (
    <section
      aria-labelledby="ai-gallery-heading"
      className="relative w-full overflow-hidden pb-24"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-neon/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyber/10 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SEO and AEO-friendly introduction */}
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/10 px-4 py-2 text-sm font-medium text-neon backdrop-blur-xl">
            <LuSparkles aria-hidden="true" className="h-4 w-4" />
            AI image prompt gallery
          </div>

          <h2
            id="ai-gallery-heading"
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Explore AI-generated images and creative prompt examples
          </h2>

          <p className="mt-5 text-pretty text-base leading-8 text-gray-400 sm:text-lg">
            Browse photorealistic, anime, fantasy, cyberpunk and abstract AI
            artwork. Copy any prompt or use it as a starting point to create
            your own image with Genova AI.
          </p>
        </header>

        {/* Category filter */}
        <nav
          aria-label="Filter AI-generated images by style"
          className="mb-12"
        >
          <div
            role="tablist"
            aria-label="AI image categories"
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="ai-gallery-results"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "rounded-full border px-5 py-2.5 text-sm font-semibold outline-none transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    isActive
                      ? "border-neon/50 bg-neon/15 text-neon shadow-[0_0_24px_rgba(0,255,136,0.16)]"
                      : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mb-6 flex items-center justify-between gap-4">
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <FiImage aria-hidden="true" className="h-4 w-4 text-cyber" />
            Showing{" "}
            <strong className="font-semibold text-white">
              {filteredImages.length}
            </strong>{" "}
            {activeCategory === "All"
              ? "AI image examples"
              : `${activeCategory.toLowerCase()} examples`}
          </p>
        </div>

        {/* Gallery */}
        <div
          id="ai-gallery-results"
          role="tabpanel"
          className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3"
        >
          {filteredImages.map((image) => {
            const isCopied = copiedId === image.id;

            return (
              <article
                key={image.id}
                className="group relative mb-6 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-neon/25 hover:shadow-[0_28px_90px_rgba(0,255,136,0.10)]"
              >
                <figure>
                  <div
                    className={`relative w-full overflow-hidden bg-black/30 ${image.aspectRatio}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.description}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"
                    />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-xl">
                        {image.category}
                      </span>
                    </div>

                    <Link
                      href={`/?prompt=${encodeURIComponent(image.prompt)}`}
                      aria-label={`Create an image using the prompt for ${image.title}`}
                      className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white opacity-100 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-neon/50 hover:bg-neon hover:text-black sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <FiExternalLink aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>

                  <figcaption className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold leading-snug text-white">
                      {image.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {image.description}
                    </p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neon">
                        AI image prompt
                      </p>

                      <p className="line-clamp-4 text-sm leading-6 text-gray-300">
                        “{image.prompt}”
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(image.id, image.prompt)}
                        aria-label={`Copy prompt for ${image.title}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
                      >
                        {isCopied ? (
                          <>
                            <FiCheck
                              aria-hidden="true"
                              className="h-4 w-4 text-neon"
                            />
                            Copied
                          </>
                        ) : (
                          <>
                            <FiCopy aria-hidden="true" className="h-4 w-4" />
                            Copy prompt
                          </>
                        )}
                      </button>

                      <Link
                        href={`/?prompt=${encodeURIComponent(image.prompt)}`}
                        aria-label={`Try the ${image.title} prompt in Genova AI`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon to-cyber px-4 py-2.5 text-sm font-bold text-black shadow-[0_10px_30px_rgba(0,255,136,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <FiZap aria-hidden="true" className="h-4 w-4" />
                        Try prompt
                      </Link>
                    </div>
                  </figcaption>
                </figure>
              </article>
            );
          })}
        </div>

        {filteredImages.length === 0 && (
          <div
            role="status"
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center"
          >
            <FiImage
              aria-hidden="true"
              className="mx-auto h-10 w-10 text-gray-500"
            />

            <h3 className="mt-4 text-xl font-semibold text-white">
              No AI images found
            </h3>

            <p className="mt-2 text-gray-400">
              Try selecting another image category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}