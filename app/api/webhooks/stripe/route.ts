import { headers } from "next/headers";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers()
  const signature = headerList.get("Stripe-Signature") as string;

  let event;
  try {
    // Verify the event actually came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  // Handle the successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerkUserId;

    if (clerkUserId) {
      await convex.mutation(api.users.upgradeToPro, { 
        userId: clerkUserId 
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}