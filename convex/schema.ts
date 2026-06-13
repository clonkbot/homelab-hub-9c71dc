import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  services: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    icon: v.string(),
    category: v.string(),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("unknown")),
    lastChecked: v.optional(v.number()),
    createdAt: v.number(),
    order: v.number(),
  }).index("by_user", ["userId"]).index("by_user_and_category", ["userId", "category"]),

  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  statusLogs: defineTable({
    serviceId: v.id("services"),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("unknown")),
    responseTime: v.optional(v.number()),
    checkedAt: v.number(),
  }).index("by_service", ["serviceId"]),
});
