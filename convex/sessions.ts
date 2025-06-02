// convex/sessions.ts - Session tracking functions
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new session
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    moduleId: v.number(),
    moduleName: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      moduleId: args.moduleId,
      moduleName: args.moduleName,
      startTime: Date.now(),
      completed: false,
      attempts: 1,
    });
    return sessionId;
  },
});

// Complete a session
export const completeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    success: v.boolean(),
    score: v.optional(v.number()),
    maxScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const endTime = Date.now();
    const duration = Math.floor((endTime - session.startTime) / 1000); // in seconds

    await ctx.db.patch(args.sessionId, {
      endTime,
      duration,
      completed: true,
      score: args.score,
      maxScore: args.maxScore,
    });

    return { sessionId: args.sessionId, duration };
  },
});

// Get user's session history
export const getUserSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50); // Last 50 sessions

    return sessions;
  },
});

// Get user's module progress
export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const completedModules = new Set<number>();
    const inProgressModules = new Set<number>();

    sessions.forEach((session) => {
      if (session.completed && session.score && session.maxScore && session.score === session.maxScore) {
        completedModules.add(session.moduleId);
      } else if (session.attempts > 0) {
        inProgressModules.add(session.moduleId);
      }
    });

    // Remove completed modules from in-progress
    completedModules.forEach((moduleId) => {
      inProgressModules.delete(moduleId);
    });

    return {
      completedModules: Array.from(completedModules),
      inProgressModules: Array.from(inProgressModules),
      totalSessions: sessions.length,
      totalTime: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
    };
  },
});




