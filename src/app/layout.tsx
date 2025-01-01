import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/global.css";
import InstallButton from "@/components/installButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GymSync",
  description: "Created By ABC",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          {/* Add PWA related meta tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          
          {/* Add Apple touch icon */}
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

          {/* Link to manifest.json */}
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <InstallButton />
          {children}
        </body>
      </html>
    </>
  );
}
