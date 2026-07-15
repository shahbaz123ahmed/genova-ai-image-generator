// src/app/gallery/page.tsx

import type { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "AI Image Gallery and Prompt Examples",
  description:
    "Explore AI-generated images and creative prompt examples in photorealistic, anime, cyberpunk, fantasy and abstract styles. Copy prompts and create your own images with Genova AI.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "AI Image Gallery and Prompt Examples | Genova AI",
    description:
      "Discover AI-generated artwork, creative styles and ready-to-use text-to-image prompts.",
    url: "https://genovaai.tech/gallery",
    type: "website",
    images: [
      {
        url: "/images/og/genova-gallery-og.jpg",
        width: 1200,
        height: 630,
        alt: "Genova AI image gallery and prompt examples",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Gallery and Prompt Examples | Genova AI",
    description:
      "Explore AI artwork and copy creative text-to-image prompts.",
    images: ["/images/og/genova-gallery-og.jpg"],
  },
};

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Genova AI Image Gallery",
  description:
    "A curated collection of AI-generated images and text-to-image prompt examples.",
  url: "https://genovaai.tech/gallery",
  isPartOf: {
    "@type": "WebSite",
    name: "Genova AI",
    url: "https://genovaai.tech",
  },
  about: [
    "AI-generated images",
    "Text-to-image prompts",
    "AI art examples",
    "Creative image generation",
  ],
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gallerySchema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-[#050508] pt-28">
        <section className="mx-auto max-w-7xl px-4 pb-10 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon">
            Genova AI inspiration gallery
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-Generated Image Gallery and Prompt Examples
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Explore high-quality AI image examples across multiple creative
            styles. Study the prompts, copy the ones you like and customize
            them to generate original artwork with Genova AI.
          </p>
        </section>

        <GalleryClient />

        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              How do you create better AI images?
            </h2>

            <p className="mt-4 leading-8 text-gray-400">
              A strong AI image prompt clearly describes the subject, visual
              style, lighting, camera angle, environment, colors and desired
              level of detail. Begin with the main subject, add the artistic
              direction and finish with composition or quality instructions.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-white sm:text-3xl">
              What can you create with Genova AI?
            </h2>

            <p className="mt-4 leading-8 text-gray-400">
              Genova AI can help creators produce concept art, marketing
              visuals, fantasy scenes, cyberpunk environments, anime
              illustrations, abstract artwork and photorealistic image ideas
              from written descriptions.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}