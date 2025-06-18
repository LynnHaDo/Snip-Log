import { v } from "convex/values";
import { mutation, query } from './_generated/server';

export const saveUser = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string()
    },
    handler: async(context, args) => {
        const existingUser = await context.db
        .query("users")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();

        if (!existingUser) {
            await context.db.insert("users", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                isPro: false
            })
        }
        else {
            console.log("User account already existed.")
        }
    }
})

export const getUser = query({
    args: {
        userId: v.string()
    },

    handler: async (context, args) => {
        if (!args.userId) return null 

        const user = await context.db.query("users")
                                     .withIndex("by_user_id")
                                     .filter((q) => q.eq(q.field("userId"), args.userId))
                                     .first();
        return user
    }
})