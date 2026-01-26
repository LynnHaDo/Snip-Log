import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

export const createSnippet = mutation({
  args: {
    title: v.string(),
    language: v.string(),
    code: v.string(),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const user = await context.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const snippetId = await context.db.insert("snippets", {
      ...args,
      userId: user._id,
      userName: user.name,
      searchMetadata: `${args.title.toLocaleLowerCase()} ${user.name.toLocaleLowerCase()}`,
    });

    // Update language stats
    const exisitingStat = await context.db
      .query("languageStats")
      .filter((q) => q.eq(q.field("language"), args.language))
      .unique();

    if (exisitingStat) {
      await context.db.patch(exisitingStat._id, {
        count: exisitingStat.count + 1,
      });
    } else {
      await context.db.insert("languageStats", {
        language: args.language,
        count: 1,
      });
    }

    return snippetId;
  },
});

export const getSnippets = query({
  args: {
    paginationOpts: paginationOptsValidator,
    keyword: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (context, args) => {
    if (args.keyword && args.keyword !== "") {
      const lowerCasedSearch = args.keyword.toLowerCase();
      return await context.db
        .query("snippets")
        .withSearchIndex("search_all", (q) => {
          const searchResult = q.search("searchMetadata", lowerCasedSearch);
          return args.language
            ? searchResult.eq("language", args.language)
            : searchResult;
        })
        .paginate(args.paginationOpts);
    }

    if (args.language) {
      return await context.db
        .query("snippets")
        .withIndex("by_language", (q) => q.eq("language", args.language!))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await context.db
      .query("snippets")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const isSnippetStarred = query({
  args: {
    snippetId: v.id("snippets"),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      return false;
    }

    const star = await context.db
      .query("stars")
      .withIndex("by_user_id_and_snippet_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) &&
          q.eq(q.field("snippetId"), args.snippetId),
      )
      .first();
    return !!star;
  },
});

export const getSnippetStarCount = query({
  args: {
    snippetId: v.id("snippets"),
  },
  handler: async (context, args) => {
    const stars = await context.db
      .query("stars")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
      .collect();
    return stars.length;
  },
});

export const getTopFiveLanguages = query({
  handler: async (context) => {
    const topFiveLanguages = await context.db
      .query("languageStats")
      .withIndex("by_count")
      .order("desc")
      .take(5);
    return topFiveLanguages;
  },
});

export const getStarredSnippets = query({
  handler: async (context) => {
    const identity = await context.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const stars = await context.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const snippets = await Promise.all(
      stars.map((star) => context.db.get(star.snippetId)),
    );
    return snippets.filter((snippet) => !!snippet);
  },
});

export const deleteSnippet = mutation({
  args: {
    snippetId: v.id("snippets"),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const snippet = await context.db.get(args.snippetId);

    if (!snippet) {
      throw new Error("Snippet is not found");
    }

    if (snippet.userId !== identity.subject) {
      throw new Error("User is not authorized to delete this snippet");
    }

    const comments = await context.db
      .query("snippetComments")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
      .collect();

    for (const comment of comments) {
      await context.db.delete(comment._id);
    }

    const stars = await context.db
      .query("stars")
      .withIndex("by_snippet_id")
      .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
      .collect();

    for (const star of stars) {
      await context.db.delete(star._id);
    }

    // Update language stats
    const exisitingStat = await context.db
      .query("languageStats")
      .filter((q) => q.eq(q.field("language"), snippet.language))
      .unique();

    if (exisitingStat) {
      if (exisitingStat.count > 2) {
        await context.db.patch(exisitingStat._id, {
          count: exisitingStat.count - 1,
        });
      } else {
        await context.db.delete(exisitingStat._id);
      }
    }

    await context.db.delete(args.snippetId);
  },
});

export const starSnippet = mutation({
  args: {
    snippetId: v.id("snippets"),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const snippet = await context.db.get(args.snippetId);

    if (!snippet) {
      throw new Error("Snippet is not found");
    }

    const existingStar = await context.db
      .query("stars")
      .withIndex("by_user_id_and_snippet_id")
      .filter(
        (q) =>
          q.eq(q.field("userId"), identity.subject) &&
          q.eq(q.field("snippetId"), args.snippetId),
      )
      .first();

    if (existingStar) {
      await context.db.delete(existingStar._id);
    } else {
      await context.db.insert("stars", {
        userId: snippet.userId,
        snippetId: snippet._id,
      });
    }
  },
});

export const getSnippetById = query({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (context, args) => {
        const snippet = await context.db.get(args.snippetId)

        if (!snippet) {
            throw new Error("Snippet not found")
        }
        
        return snippet
    }
})

export const getComments = query({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (context, args) => {
        const comments = await context.db.query('snippetComments').withIndex('by_snippet_id')
                                    .filter(q => q.eq(q.field('snippetId'), args.snippetId))
                                    .order('desc')
                                    .collect()
        
        return comments
    }
})

export const addComment = mutation({
    args: {
        snippetId: v.id('snippets'),
        content: v.string()
    },
    handler: async (context, args) => {
        if (args.content === "") {
            throw new Error("Comment cannot be empty.")
        }

        const identity = await context.auth.getUserIdentity();

        if (!identity) {
            throw new Error("User is not authenticated");
        }

        const user = await context.db.query('users').withIndex('by_user_id').filter(q => q.eq(q.field('userId'), identity.subject)).first()

        if (!user) {
            throw new Error('User is not found');
        }

        const snippet = await context.db.get(args.snippetId);

        if (!snippet) {
        throw new Error("Snippet is not found");
        }

        return await context.db.insert('snippetComments', {
            userId: user._id,
            userName: user.name,
            snippetId: args.snippetId,
            content: args.content
        })
    }
})

export const deleteComment = mutation({
    args: {
        commentId: v.id('snippetComments')
    },
    handler: async (context, args) => {
        const identity = await context.auth.getUserIdentity();

        if (!identity) {
            throw new Error("User is not authenticated");
        }

        const user = await context.db.query('users').withIndex('by_user_id').filter(q => q.eq(q.field('userId'), identity.subject)).first()

        if (!user) {
            throw new Error('User is not found');
        }

        const comment = await context.db.get(args.commentId);

        if (!comment) {
            throw new Error("Comment is not found.")
        }
        
        if (comment.userId !== user._id) {
            throw new Error("User is not authorized to delete this comment")
        }

        await context.db.delete(args.commentId)
    }
})

// Mutation handlers
export const backfillSearchMetadata = internalMutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("snippets"),
        metadata: v.string(),
      }),
    ),
  },
  handler: async (context, args) => {
    for (const update of args.updates) {
      await context.db.patch(update.id, {
        searchMetadata: update.metadata,
      });
    }
  },
});

export const getUnprocessedSnippets = internalQuery({
  handler: async (context) => {
    return await context.db
      .query("snippets")
      .filter((q) => q.eq(q.field("searchMetadata"), undefined))
      .take(50);
  },
});

export const backfillTopLanguages = internalMutation({
  handler: async (context) => {
    const snippets = await context.db.query("snippets").collect();

    for (const snippet of snippets) {
      const exisitingStat = await context.db
        .query("languageStats")
        .filter((q) => q.eq(q.field("language"), snippet.language))
        .unique();

      if (exisitingStat) {
        await context.db.patch(exisitingStat._id, {
          count: exisitingStat.count + 1,
        });
      } else {
        await context.db.insert("languageStats", {
          language: snippet.language,
          count: 1,
        });
      }
    }
  },
});
