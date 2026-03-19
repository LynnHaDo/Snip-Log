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

  let event: Stripe.Event;
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

  try {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const clerkUserId = session.metadata?.clerkUserId;

            if (clerkUserId) {
                await convex.mutation(api.users.updateSubscription, { 
                    userId: clerkUserId,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string | undefined,
                    isPro: true,
                    planType: session.metadata?.planType as "pro" | "early-adopter"
                });
            }

            break;
        }

        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await convex.mutation(api.users.updateSubscription, { 
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                isPro: subscription.status === "active",
                planType: "pro"
            });

            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;

            await convex.mutation(api.users.updateSubscription, { 
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: undefined,
                isPro: false,
                planType: "basic"
            });

            break;
        }
    }
  } catch (e) {
    console.error(`Error connecting to Convex database: ${e}`);
    return new Response(`Error connecting to Convex database: ${e}`, { status: 500 });
  }

  return new Response("Webhook processed successfully", { status: 200 });
}