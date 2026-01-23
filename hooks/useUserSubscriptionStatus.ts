"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

export default function useUserSubscriptionStatus() {
    const { user, isSignedIn } = useUser();
    const convexUser = useQuery(
        api.users.getUser,
        user?.id ? { userId: user.id } : 'skip'
    )

    const isPro = !!convexUser?.isPro

    return { isPro, isSignedIn }
}