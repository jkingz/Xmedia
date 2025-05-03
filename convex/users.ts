import { v } from 'convex/values';
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';

// Get user by clerkId
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});

// Create a new task with the given text
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (existingUser) return;

    // Otherwise create a new user and insert it into the database
    // TODO: add validation to ensure that the username is unique and that the email is valid and not already in use
    await ctx.db.insert('users', {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
      likes: 0,
    });
  },
});

// helper function to get authenticated user
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }
  const currentUser = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
    .first();
  if (!currentUser) {
    throw new Error('User not found');
  }
  return currentUser;
}
