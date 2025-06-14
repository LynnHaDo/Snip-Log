import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnipLog",
  description: "code diary for leetcode procrastinators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <ConvexClientProvider>
            <html lang="en">
                    <body
                        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                    >
                        <header className="flex justify-end items-center p-4 gap-4 h-16">
                            <SignedOut>
                                <SignInButton />
                                <SignUpButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                                <SignOutButton />
                            </SignedIn>
                        </header>
                        {children}
                    </body>
                </html>
        </ConvexClientProvider>
    );
}
