import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const toggleBookmarked = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // check if bookmark already exists
    const existingBookmark = await ctx.db
      .query('bookmarks')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId),
      )
      .unique();

    // if bookmark exists, delete it otherwise create it
    // return true if bookmark is created, false if bookmark is deleted
    if (existingBookmark) {
      await ctx.db.delete(existingBookmark._id);
      return false;
    } else {
      await ctx.db.insert('bookmarks', {
        userId: currentUser._id,
        postId: args.postId,
      });
      return true;
    }
  },
});

export const getBookmarks = query({
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const bookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id))
      .order('desc')
      .collect();

    const bookmarkWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);
        return {
          ...bookmark,
          post,
        };
      }),
    );
    return bookmarkWithInfo;
  },
});
