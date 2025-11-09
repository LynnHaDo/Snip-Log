import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { METADATA } from "./(root)/_constants/editorConfig";

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
                <meta name="description" content={METADATA.description as string}></meta>
            </header>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
                >
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
