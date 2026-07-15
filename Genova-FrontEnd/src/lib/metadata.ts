import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type CreateMetadataProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  noIndex = false,
}: CreateMetadataProps): Metadata {
  const canonicalUrl = `${siteConfig.url}${path}`;

  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
