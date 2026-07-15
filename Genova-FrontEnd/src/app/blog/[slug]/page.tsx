import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiHome,
  FiUser,
  FiZap,
} from "react-icons/fi";

import { getPost, getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import { createArticleSchema } from "@/lib/schema";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested Genova AI article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const articleUrl = `${siteConfig.url}/blog/${post.slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${siteConfig.url}${post.image}`;

  return {
    title: post.title,
    description: post.description,

    authors: [
      {
        name: post.authorName,
      },
    ],

    alternates: {
      canonical: `/blog/${post.slug}`,
    },

    openGraph: {
      type: "article",
      url: articleUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    getPost(slug),
    getAllPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const articleSchema = createArticleSchema(post);

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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen bg-black pb-24">
        {/* Article hero */}
        <header className="relative overflow-hidden border-b border-white/10">
          <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[720px]">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/45"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"
            />

            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-5xl px-4 pb-14 pt-32 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                {/* Breadcrumb navigation */}
                <nav
                  aria-label="Breadcrumb"
                  className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-300"
                >
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-neon"
                  >
                    <FiHome aria-hidden="true" className="h-3.5 w-3.5" />
                    Home
                  </Link>

                  <span aria-hidden="true" className="text-white/30">
                    /
                  </span>

                  <Link
                    href="/blog"
                    className="transition-colors hover:text-neon"
                  >
                    Blog
                  </Link>

                  <span aria-hidden="true" className="text-white/30">
                    /
                  </span>

                  <span
                    aria-current="page"
                    className="max-w-[250px] truncate text-white sm:max-w-md"
                  >
                    {post.title}
                  </span>
                </nav>

                <Link
                  href="/blog"
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:border-neon/40 hover:text-neon"
                >
                  <FiArrowLeft aria-hidden="true" />
                  Back to all guides
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <FiCalendar aria-hidden="true" className="text-neon" />
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </span>

                  <span aria-hidden="true" className="text-white/25">
                    •
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <FiUser aria-hidden="true" className="text-cyber" />
                    By {post.authorName}
                  </span>

                  <span aria-hidden="true" className="text-white/25">
                    •
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <FiClock aria-hidden="true" className="text-neon" />
                    {readingTime} min read
                  </span>
                </div>

                <h1 className="mt-6 max-w-5xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  {post.title}
                </h1>

                <p className="mt-6 max-w-3xl text-pretty text-base leading-8 text-gray-300 sm:text-lg lg:text-xl">
                  {post.description}
                </p>

                {post.updatedAt &&
                  post.updatedAt !== post.publishedAt && (
                    <p className="mt-5 text-sm text-gray-400">
                      Last updated{" "}
                      <time dateTime={post.updatedAt}>
                        {formatDate(post.updatedAt)}
                      </time>
                    </p>
                  )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-20">
          {/* Main article */}
          <article className="min-w-0">
            {/* Answer-first summary for AEO */}
            <section
              aria-labelledby="article-summary-heading"
              className="mb-12 rounded-[1.5rem] border border-neon/20 bg-neon/[0.055] p-6 sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neon">
                Key takeaway
              </p>

              <h2
                id="article-summary-heading"
                className="mt-3 text-2xl font-bold text-white"
              >
                What will you learn from this guide?
              </h2>

              <p className="mt-4 text-base leading-8 text-gray-300">
                {post.description}
              </p>
            </section>

            <div className="prose prose-lg max-w-none prose-invert prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h2:mt-14 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl prose-p:leading-8 prose-p:text-gray-300 prose-a:font-semibold prose-a:text-cyber prose-a:no-underline hover:prose-a:text-neon prose-strong:text-white prose-li:text-gray-300 prose-blockquote:border-neon prose-blockquote:text-gray-300 prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
              <div className="whitespace-pre-line text-gray-300">
                {post.content}
              </div>
            </div>

            {/* Author block */}
            <section
              aria-labelledby="article-author-heading"
              className="mt-16 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyber">
                Written by
              </p>

              <h2
                id="article-author-heading"
                className="mt-3 text-2xl font-bold text-white"
              >
                {post.authorName}
              </h2>

              <p className="mt-3 leading-7 text-gray-400">
                This article is part of the Genova AI learning hub, which
                provides practical guidance about AI image generation, prompt
                engineering and creative text-to-image workflows.
              </p>
            </section>

            {/* CTA */}
            <section className="relative mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-neon/10 via-white/[0.04] to-cyber/10 p-8 text-center sm:p-12">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-neon/15 blur-[90px]"
              />

              <div className="relative">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/15 text-neon">
                  <FiZap aria-hidden="true" className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                  Turn your idea into an AI-generated image
                </h2>

                <p className="mx-auto mt-4 max-w-2xl leading-8 text-gray-400">
                  Write a text prompt, select your preferred visual style and
                  start generating original images with Genova AI.
                </p>

                <Link
                  href="/"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon to-cyber px-8 py-3 text-sm font-bold text-black shadow-[0_15px_40px_rgba(0,255,136,0.18)] transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  Start generating
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neon">
                  Article details
                </p>

                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Published</dt>
                    <dd className="mt-1 text-white">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-gray-500">Author</dt>
                    <dd className="mt-1 text-white">{post.authorName}</dd>
                  </div>

                  <div>
                    <dt className="text-gray-500">Reading time</dt>
                    <dd className="mt-1 text-white">
                      Approximately {readingTime} minutes
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-neon/20 bg-neon/[0.055] p-6">
                <h2 className="text-lg font-bold text-white">
                  Create with Genova AI
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Transform text descriptions into original AI-generated
                  visuals.
                </p>

                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon transition-colors hover:text-cyber"
                >
                  Open image generator
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section
            aria-labelledby="related-articles-heading"
            className="mx-auto max-w-7xl border-t border-white/10 px-4 pt-20 sm:px-6 lg:px-8"
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyber">
                  Continue learning
                </p>

                <h2
                  id="related-articles-heading"
                  className="mt-2 text-3xl font-bold text-white sm:text-4xl"
                >
                  Related AI guides
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neon hover:text-cyber"
              >
                View all articles
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.slug}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] transition-all duration-500 hover:-translate-y-1 hover:border-neon/25"
                >
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="relative block aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>

                  <div className="p-6">
                    <time
                      dateTime={relatedPost.publishedAt}
                      className="text-xs text-gray-500"
                    >
                      {formatDate(relatedPost.publishedAt)}
                    </time>

                    <h3 className="mt-3 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-neon">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-400">
                      {relatedPost.description}
                    </p>

                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neon"
                    >
                      Read guide
                      <FiArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}