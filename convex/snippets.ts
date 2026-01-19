import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    });

    return snippetId;
  },
});

export const getSnippets = query({
  handler: async (context) => {
    const snippets = await context.db.query("snippets").order("desc").collect();
    return snippets;
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

    if (snippet.userId !== identity.subject) {
      throw new Error("User is not authorized to star this snippet");
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
