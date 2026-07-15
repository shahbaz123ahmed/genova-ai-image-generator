import { siteConfig } from "@/lib/site";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/logo.png`,
    width: 512,
    height: 512,
  },
  description: siteConfig.description,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
  inLanguage: "en",
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${siteConfig.url}/#software`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "AI Image Generator",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript and a modern web browser",
  softwareHelp: `${siteConfig.url}/guides`,
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
  offers: {
    "@type": "Offer",
    url: `${siteConfig.url}/pricing`,
    priceCurrency: "USD",
    price: "0",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Text-to-image generation",
    "Multiple AI image styles",
    "Image generation history",
    "High-quality image downloads",
  ],
};

export function createArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [`${siteConfig.url}${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}
