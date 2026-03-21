"use server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { PayPlanFrequency } from "../pricing/_constants/plan";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function createCheckoutSession(
  priceId: string,
  frequency: PayPlanFrequency,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const mode = frequency === "one-time" ? "payment" : "subscription";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: mode,
    customer_creation: mode === "payment" ? "always" : undefined,
    line_items: [
      {
        price: priceId, // The Stripe Price ID you create in your dashboard
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      clerkUserId: userId,
      planType: frequency === "one-time" ? "early-adopter" : "pro",
    },
  });

  return session.url;
}

export async function createCustomerPortalSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await convex.query(api.users.getUser, { userId })

  if (!user || !user.stripeCustomerId) {
    throw new Error("No active Stripe Customer ID found for this user.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/profile`,
  })

  return portalSession.url
}
