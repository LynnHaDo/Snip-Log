"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

export default function useUserSubscriptionStatus() {
    const { user, isLoaded: isClerkLoaded } = useUser();
    const convexUser = useQuery(
        api.users.getUser,
        user?.id ? { userId: user.id } : 'skip'
    )

    const isLoaded = isClerkLoaded && convexUser !== undefined
    const isPro = !!convexUser?.isPro

    return { isPro, isLoaded }
}