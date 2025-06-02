import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(),
        email: v.string(),
        userName: v.string(),
        isPro: v.boolean(),
        proSince: v.optional(v.number()),
        lsId: v.optional(v.string()),
        lsSubscriptionId: v.optional(v.string())
    }).index("by_user_id", ["userId"]),

    codeExecutions: defineTable({
        userId: v.id("users"),
        language: v.string(),
        code: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string())
    }).index("by_user_id", ["userId"]),

    snippets: defineTable({
        userId: v.id("users"),
        userName: v.string(), // for easy access
        title: v.string(),
        language: v.string(),
        code: v.string(),
    }).index("by_user_id", ["userId"]),

    snippetComments: defineTable({
        snippetId: v.id("snippets"),
        userId: v.string(),
        userName: v.string(), // for easy access
        content: v.string() // html 
    }).index("by_snippet_id", ["snippetId"]),

    stars: defineTable({
        userId: v.id("users"),
        snippetId: v.id("snippets")
    })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"])
})