import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WebGL Background Generator",
  description:
    "Interactive 3D particle wave generator with real-time rendering and camera controls. Create stunning animated backgrounds with flowing wave patterns.",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    shrinkToFit: false,
  },
  openGraph: {
    title: "WebGL Background Generator",
    description:
      "Interactive 3D particle wave generator with real-time rendering and camera controls. Create stunning animated backgrounds with flowing wave patterns.",
    url: "https://v0-particle-simulator-ui.vercel.app",
    siteName: "particle.generator",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebGL Background Generator - Interactive 3D particle wave generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebGL Background Generator",
    description:
      "Interactive 3D particle wave generator with real-time rendering and camera controls.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://v0-particle-simulator-ui.vercel.app"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans antialiased h-full`}>{children}</body>
    </html>
  )
}
