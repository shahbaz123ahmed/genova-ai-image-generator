import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes = [
    {
      path: "",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      path: "/ai-image-generator",
      changeFrequency: "weekly" as const,
      priority: 0.95,
    },
    {
      path: "/text-to-image",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/free-ai-image-generator",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/ai-art-generator",
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      path: "/gallery",
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      path: "/pricing",
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
    {
      path: "/blog",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const staticRoutes = routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const posts = await getAllPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
