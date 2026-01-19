import { v } from "convex/values";
import { mutation } from './_generated/server';
import { Id } from "./_generated/dataModel";

export const createSnippet = mutation({
    args: {
        title: v.string(),
        language: v.string(),
        code: v.string()
    },
    handler: async(context, args) => {
        const identity = await context.auth.getUserIdentity()

        if (!identity) {
            throw new Error("User is not authenticated")
        }

        const user = await context.db.query("users")
                               .withIndex("by_user_id")
                               .filter(q => q.eq(q.field("userId"), identity.subject))
                               .first()
        
        if (!user) {
            throw new Error("User not found")
        }

        const snippetId = await context.db.insert("snippets", {
            ...args,
            userId: user._id,
            userName: user.name
        })

        return snippetId
    }
})