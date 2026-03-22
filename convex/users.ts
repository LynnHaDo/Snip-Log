import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (context, args) => {
    const existingUser = await context.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await context.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
      });
    } else {
      console.log("User account already existed.");
    }
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },

  handler: async (context, args) => {
    if (!args.userId) return null;

    const user = await context.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return user;
  },
});

export const updateUserName = mutation({
  args: {
    username: v.string()
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
    
    if (!user) {
        throw new Error('User is not found');
    }

    await ctx.db.patch(user._id, {
        name: args.username
    })
  },
});

export const updateSubscription = mutation({
  args: {
    userId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    isPro: v.boolean(),
    planType: v.union(
      v.literal("basic"),
      v.literal("pro"),
      v.literal("early-adopter"),
    ),
  },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_stripe_customer_id", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId),
      )
      .first();

    if (!user && args.userId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId!))
        .first();
    }

    if (!user) {
      throw new ConvexError("Webhook error: User not found");
    }

    await ctx.db.patch(user._id, {
      isPro: args.isPro,
      proSince: args.isPro ? new Date().getFullYear() : undefined,
      planType: args.planType,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
    });
  },
});
