"use server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { PayPlanFrequency } from "../pricing/_constants/plan";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string, frequency: PayPlanFrequency) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const mode = frequency === "one-time" ? "payment" : "subscription"

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: mode,
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
      planType: frequency === "one-time" ? "early-adopter" : "pro"
    },
  });

  return session.url;
}