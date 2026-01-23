// @/lib/getSubscriptionStatus.ts
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

export async function getSubscriptionStatus() {
  const { userId } = await auth();
  if (!userId) return false;

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, { userId });

  return !!convexUser?.isPro;
}