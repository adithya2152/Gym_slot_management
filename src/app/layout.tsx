import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/global.css";

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
      {/* Add DOCTYPE */}
      
      <html lang="en">
        <head>
          {/* Link to manifest.json */}
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </>
  );
}
