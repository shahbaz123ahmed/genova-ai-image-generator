import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from 'react-hot-toast'  // npm install react-hot-toast for notifications (optional, add if want)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Genova | AI Image Generator",
    template: "%s | Genova AI",
  },
  description: "Create stunning, high-quality images from text descriptions in seconds using Genova's advanced AI image generation.",
  keywords: ["AI Image Generator", "Text to Image", "Genova AI", "AI Art", "Stable Diffusion", "Midjourney Alternative"],
  authors: [{ name: "Genova AI" }],
  creator: "Genova AI",
  publisher: "Genova AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://genovaai.tech"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Genova | AI Image Generator",
    description: "Create stunning, high-quality images from text descriptions in seconds.",
    url: "https://genovaai.tech",
    siteName: "Genova AI",
    images: [
      {
        url: "/ai-image-1.jpg", // Using one of your public images as the preview
        width: 1200,
        height: 630,
        alt: "Genova AI Image Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genova | AI Image Generator",
    description: "Create stunning, high-quality images from text descriptions in seconds.",
    images: ["/ai-image-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white min-h-screen gradient-bg`}
      >
        {children}
        {/* <Toaster /> Optional */}
      </body>
    </html>
  );
}
