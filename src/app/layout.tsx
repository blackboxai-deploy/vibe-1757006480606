import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnimaGenius - AI Video Synthesis SaaS Platform",
  description: "Transform documents, data, and media into professional animated videos using advanced AI. Enterprise-grade video generation with multi-AI integration.",
  keywords: "AI video generation, video synthesis, SaaS platform, document to video, AI animation, professional video creation",
  authors: [{ name: "AnimaGenius Team" }],
  creator: "AnimaGenius",
  publisher: "AnimaGenius",
  robots: "index, follow",
  openGraph: {
    title: "AnimaGenius - AI Video Synthesis SaaS Platform",
    description: "Transform documents into professional videos with AI",
    type: "website",
    url: "https://animagenius.com",
    siteName: "AnimaGenius",
    images: [
      {
        url: "https://placehold.co/1200x630?text=AnimaGenius+AI+Video+Synthesis+Platform+with+enterprise+features+and+multi+AI+integration",
        width: 1200,
        height: 630,
        alt: "AnimaGenius AI Video Synthesis Platform with enterprise features and multi AI integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimaGenius - AI Video Synthesis SaaS",
    description: "Enterprise AI video generation platform",
    creator: "@animagenius",
    images: ["https://placehold.co/1200x630?text=AnimaGenius+AI+Video+Platform"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-background border-border text-foreground",
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}