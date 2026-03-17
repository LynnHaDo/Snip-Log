import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const runCodeExecutionUserIdsMutation = mutation({
    handler: async (ctx) => {
        const executions = await ctx.db.query('codeExecutions').collect();
        let updatedCount = 0;

        for (const execution of executions) {
            if (!execution.userId.startsWith("user_")) {
                const user = await ctx.db.query("users")
                    .withIndex("by_user_id")
                    .filter((q) => q.eq(q.field("userId"), execution.userId))
                    .first();

                if (user && user.userId) {
                    // Patch the execution record to use Clerk ID
                    await ctx.db.patch(execution._id, {
                        userId: user.userId
                    })
                    updatedCount += 1
                }
            }
        }

        return `Migration complete! Successfully updated ${updatedCount} code execution records.`;
    }
})

export const runStarsUserIdsMutation = mutation({
    handler: async (ctx) => {
        const stars = await ctx.db.query('stars').collect();
        let updatedCount = 0;

        for (const star of stars) {
            if (!star.userId.startsWith("user_")) {
                const user = await ctx.db.get(star.userId as Id<"users">);

                if (user && user.userId) {
                    // Patch the star record to use Clerk ID
                    await ctx.db.patch(star._id, {
                        userId: user.userId
                    })
                    updatedCount += 1
                }
            }
        }

        return `Migration complete! Successfully updated ${updatedCount} code execution records.`;
    }
})