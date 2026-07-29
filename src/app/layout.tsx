import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Misteri Theater Berdarah — Game 3D Misteri Pembunuhan",
  description:
    "Game 3D misteri pembunuhan interaktif. Empat tersangka, satu malam, satu kebenaran. Selidiki dengan kaca pembesar, balik berkas kasus, dan ikuti benang merah.",
  keywords: [
    "game misteri",
    "pembunuhan",
    "3D",
    "detektif",
    "teater",
    "JKT48",
    "interaktif",
  ],
  authors: [{ name: "Misteri Theater Berdarah" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Misteri Theater Berdarah",
    description: "Game 3D misteri pembunuhan interaktif.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
