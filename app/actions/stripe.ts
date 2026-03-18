"use server";
import Stripe from "stripe";
import { useAuth } from "@clerk/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession() {
  const { userId } = useAuth();
  if (!userId) throw new Error("Unauthorized");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription", // or "payment" for the one-time plan
    line_items: [
      {
        price: "price_1234567890", // The Stripe Price ID you create in your dashboard
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      clerkUserId: userId,
    },
  });

  return session.url;
}