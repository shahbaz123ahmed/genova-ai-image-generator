import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://genovaai.tech"

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard'], // Prevent search engines from indexing the private dashboard
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
