import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { METADATA } from "./(root)/_constants/editorConfig";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <header>
        <title>{METADATA.title as string}</title>
        <meta
          name="description"
          content={METADATA.description as string}
        ></meta>
      </header>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
        >
          <div className="min-h-screen h-100">
            <div className="max-w-[1800px] mx-auto p-4">
              <ConvexClientProvider>
                <Header />
                {children}
                <Footer slogan={METADATA.description as string} />
                <Toaster />
              </ConvexClientProvider>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
