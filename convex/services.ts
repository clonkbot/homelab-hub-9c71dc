import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("services")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    icon: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("services")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await ctx.db.insert("services", {
      ...args,
      userId,
      status: "unknown",
      createdAt: Date.now(),
      order: existing.length,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    icon: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("online"), v.literal("offline"), v.literal("unknown"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.id);
    if (!service || service.userId !== userId) throw new Error("Not found");

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, { ...filteredUpdates, lastChecked: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.id);
    if (!service || service.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("services"),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("unknown")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const service = await ctx.db.get(args.id);
    if (!service || service.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.id, {
      status: args.status,
      lastChecked: Date.now(),
    });

    await ctx.db.insert("statusLogs", {
      serviceId: args.id,
      status: args.status,
      checkedAt: Date.now(),
    });
  },
});
