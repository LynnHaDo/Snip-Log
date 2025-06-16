'use client'

import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Home() {
    

    return (
        <>
            <div className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                                            <SignInButton />
                                            <SignUpButton />
                                        </SignedOut>
                                        <SignedIn>
                                            <UserButton />
                                            <SignOutButton />
                                        </SignedIn>                 
            </div>
        </>
    );
}
