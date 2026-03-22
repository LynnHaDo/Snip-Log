import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    planType: v.optional(
      v.union(v.literal("basic"), v.literal("pro"), v.literal("early-adopter")),
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_stripe_customer_id", ["stripeCustomerId"]),

  codeExecutions: defineTable({
    userId: v.string(), // clerk id
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    searchMetadata: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_language", ["language"])
    .searchIndex("search_all", {
      searchField: "searchMetadata",
      filterFields: ["language"],
    }),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId: v.string(),
    content: v.string(), // html
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  languageStats: defineTable({
    language: v.string(),
    count: v.number(),
  }).index("by_count", ["count"]),
});
