import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiFileText,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

import { createMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = createMetadata({
  title: "AI Image Generation Blog, Prompt Guides and Tutorials",
  description:
    "Learn how to create better AI images with practical prompt engineering guides, AI art tutorials, image-generation tips and Genova AI platform updates.",
  path: "/blog",
  image: "/images/og/genova-ai-blog-og.jpg",
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function calculateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  const sortedPosts = [...posts].sort(
    (firstPost, secondPost) =>
      new Date(secondPost.publishedAt).getTime() -
      new Date(firstPost.publishedAt).getTime()
  );

  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog/#blog`,
    name: "Genova AI Blog",
    headline: "AI Image Generation Guides, Tutorials and Prompt Tips",
    description:
      "Practical AI image-generation tutorials, prompt engineering guides, creative workflows and Genova AI platform updates.",
    url: `${siteConfig.url}/blog`,
    inLanguage: "en",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    blogPost: sortedPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      image: post.image.startsWith("http")
        ? post.image
        : `${siteConfig.url}${post.image}`,
      author: {
        "@type": "Person",
        name: post.authorName,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="relative min-h-screen overflow-hidden bg-black pb-24 pt-28">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-x-0 top-0 h-[650px] bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.14),_transparent_55%)]" />

          <div className="absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full bg-neon/10 blur-[130px]" />

          <div className="absolute right-0 top-[450px] h-96 w-96 rounded-full bg-cyber/10 blur-[150px]" />
        </div>

        {/* Hero */}
        <section
          aria-labelledby="blog-heading"
          className="relative mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/10 px-4 py-2 text-sm font-semibold text-neon backdrop-blur-xl">
              <LuSparkles aria-hidden="true" className="h-4 w-4" />
              Genova AI learning hub
            </div>

            <h1
              id="blog-heading"
              className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              AI image generation
              <span className="block bg-gradient-to-r from-neon to-cyber bg-clip-text text-transparent">
                guides and tutorials
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-8 text-gray-400 sm:text-lg lg:text-xl">
              Learn how to write better AI image prompts, generate
              professional-quality artwork and apply text-to-image tools to
              creative, marketing and design projects.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span className="inline-flex items-center gap-2">
              <FiBookOpen aria-hidden="true" className="text-neon" />
              Practical tutorials
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span className="inline-flex items-center gap-2">
              <FiEdit3 aria-hidden="true" className="text-cyber" />
              Prompt engineering
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span className="inline-flex items-center gap-2">
              <FiFileText aria-hidden="true" className="text-neon" />
              AI platform updates
            </span>
          </div>
        </section>

        {sortedPosts.length > 0 ? (
          <>
            {/* Featured article */}
            {featuredPost && (
              <section
                aria-labelledby="featured-article-heading"
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon">
                      Editor&apos;s pick
                    </p>

                    <h2
                      id="featured-article-heading"
                      className="mt-2 text-2xl font-bold text-white sm:text-3xl"
                    >
                      Featured article
                    </h2>
                  </div>
                </div>

                <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:border-neon/25 hover:shadow-[0_35px_120px_rgba(0,255,136,0.08)]">
                  <div className="grid items-stretch lg:grid-cols-[1.15fr_0.85fr]">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="relative block min-h-[320px] overflow-hidden sm:min-h-[430px] lg:min-h-[520px]"
                      aria-label={`Read ${featuredPost.title}`}
                    >
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.imageAlt}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:to-black/20"
                      />

                      <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xl">
                        Featured guide
                      </span>
                    </Link>

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-400">
                        <time dateTime={featuredPost.publishedAt}>
                          {formatDate(featuredPost.publishedAt)}
                        </time>

                        <span aria-hidden="true" className="text-white/20">
                          •
                        </span>

                        <span>By {featuredPost.authorName}</span>

                        <span aria-hidden="true" className="text-white/20">
                          •
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <FiClock aria-hidden="true" className="h-3.5 w-3.5" />
                          {calculateReadingTime(featuredPost.content)} min read
                        </span>
                      </div>

                      <h2 className="mt-5 text-balance text-3xl font-bold leading-tight text-white transition-colors group-hover:text-neon sm:text-4xl">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="mt-5 text-base leading-8 text-gray-400">
                        {featuredPost.description}
                      </p>

                      <div className="mt-8">
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon to-cyber px-7 py-3 text-sm font-bold text-black shadow-[0_14px_35px_rgba(0,255,136,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          Read featured guide
                          <FiArrowRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {/* Latest articles */}
            {remainingPosts.length > 0 && (
              <section
                aria-labelledby="latest-articles-heading"
                className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8"
              >
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyber">
                    Learn and create
                  </p>

                  <h2
                    id="latest-articles-heading"
                    className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
                  >
                    Latest AI guides and insights
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-gray-400">
                    Explore practical AI image-generation tutorials, tested
                    prompt techniques and creative workflow ideas.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post) => {
                    const readingTime = calculateReadingTime(post.content);

                    return (
                      <article
                        key={post.slug}
                        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyber/30 hover:shadow-[0_28px_90px_rgba(0,200,255,0.09)]"
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          aria-label={`Read ${post.title}`}
                          className="relative block aspect-[16/10] w-full overflow-hidden bg-white/5"
                        >
                          <Image
                            src={post.image}
                            alt={post.imageAlt}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-gray-400">
                            <time dateTime={post.publishedAt}>
                              {formatDate(post.publishedAt)}
                            </time>

                            <span aria-hidden="true" className="text-white/20">
                              •
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <FiClock
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                              {readingTime} min read
                            </span>
                          </div>

                          <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-neon sm:text-2xl">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-gray-400">
                            {post.description}
                          </p>

                          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                            <span className="text-xs text-gray-500">
                              By {post.authorName}
                            </span>

                            <Link
                              href={`/blog/${post.slug}`}
                              aria-label={`Read the full article: ${post.title}`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-neon transition-colors hover:text-cyber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
                            >
                              Read article
                              <FiArrowRight
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* AEO information section */}
            <section
              aria-labelledby="ai-learning-heading"
              className="mx-auto mt-24 max-w-5xl px-4 sm:px-6 lg:px-8"
            >
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-7 sm:p-10 lg:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neon">
                  AI image generation learning center
                </p>

                <h2
                  id="ai-learning-heading"
                  className="mt-3 text-3xl font-bold text-white sm:text-4xl"
                >
                  Learn how to create better AI-generated images
                </h2>

                <p className="mt-5 leading-8 text-gray-400">
                  The Genova AI blog provides practical guidance for creating
                  images from text. Each guide explains prompt structure,
                  artistic styles, lighting, composition and common mistakes
                  that can affect image quality.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                    <h3 className="text-xl font-bold text-white">
                      What is prompt engineering?
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-400">
                      Prompt engineering is the process of writing clear,
                      structured instructions that help an AI model understand
                      the subject, style, lighting, composition and visual
                      details you want it to generate.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                    <h3 className="text-xl font-bold text-white">
                      What will you learn?
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-400">
                      You will learn how to structure text-to-image prompts,
                      create realistic and artistic visuals, choose useful
                      descriptive terms and improve weak image-generation
                      results.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-20 text-center">
              <FiBookOpen
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-500"
              />

              <h2 className="mt-5 text-2xl font-bold text-white">
                AI guides are coming soon
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                We are preparing practical prompt engineering tutorials and AI
                image-generation guides.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon to-cyber px-7 py-3 text-sm font-bold text-black"
              >
                Try Genova AI
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}