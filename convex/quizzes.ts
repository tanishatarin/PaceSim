// convex/quizzes.ts - Quiz attempt tracking
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordQuizAttempt = mutation({
  args: {
    userId: v.id("users"),
    moduleId: v.number(),
    sessionId: v.id("sessions"),
    questions: v.array(v.object({
      questionIndex: v.number(),
      selectedAnswer: v.number(),
      correctAnswer: v.number(),
      isCorrect: v.boolean(),
    })),
    score: v.number(),
    maxScore: v.number(),
  },
  handler: async (ctx, args) => {
    const attemptId = await ctx.db.insert("quiz_attempts", {
      userId: args.userId,
      moduleId: args.moduleId,
      sessionId: args.sessionId,
      questions: args.questions,
      score: args.score,
      maxScore: args.maxScore,
      completedAt: Date.now(),
    });

    return attemptId;
  },
});

// Get quiz attempts for a user
export const getUserQuizAttempts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(100);

    return attempts;
  },
});