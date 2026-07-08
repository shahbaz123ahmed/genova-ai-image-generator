import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from 'react-hot-toast'  // npm install react-hot-toast for notifications (optional, add if want)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genova",
  description: "Text to Image Generator",
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
