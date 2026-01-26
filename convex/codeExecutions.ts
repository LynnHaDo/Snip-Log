import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { DEFAULT_LANGUAGE } from "@/constants/configs";

export const saveExecution = mutation({
  args: {
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // Check pro status
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user?.isPro && args.language !== DEFAULT_LANGUAGE) {
      throw new ConvexError("Pro subscription required to use this language");
    }

    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: user!._id,
    });
  },
});

export const getUserExecutions = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getUserStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (context, args) => {
    const executions = await context.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const stars = await context.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const snippetIds = stars.map((star) => star.snippetId);
    const snippets = await Promise.all(
      snippetIds.map((id) => context.db.get(id)),
    );

    const starredLanguages = snippets.reduce(
      (res, currSnippet) => {
        if (currSnippet?.language) {
          res[currSnippet.language] = (res[currSnippet.language] || 0) + 1;
        }
        return res;
      },
      {} as Record<string, number>,
    );

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      "N/A";

    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000,
    ).length;
    const languageStats = executions.reduce(
      (res, currExecution) => {
        res[currExecution.language] = (res[currExecution.language] || 0) + 1;
        return res;
      },
      {} as Record<string, number>,
    );
    const languages = Object.keys(languageStats);
    const favoriteLanguage = languages.length
      ? languages.reduce((mostUsedLanguage, curLanguage) =>
          languageStats[mostUsedLanguage] > languageStats[curLanguage]
            ? mostUsedLanguage
            : curLanguage,
        )
      : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});
