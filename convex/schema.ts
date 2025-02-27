import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(),
    institution: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    moduleId: v.number(),
    moduleName: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    duration: v.optional(v.number()), // in seconds
    completed: v.boolean(),
    score: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    attempts: v.number(),
  }).index("by_user", ["userId"]),
});