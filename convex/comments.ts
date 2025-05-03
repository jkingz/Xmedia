import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    // Add logic to add a comment to the database
    const currentUser = await getAuthenticatedUser(ctx);

    const normalizedPostId = ctx.db.normalizeId('posts', args.postId);
    if (!normalizedPostId) throw new ConvexError('Invalid Post ID');
    const post = await ctx.db.get(normalizedPostId);
    if (!post) throw new ConvexError('Post not found');

    const commentId = await ctx.db.insert('comments', {
      content: args.content,
      userId: currentUser?._id,
      postId: args.postId,
    });

    //increment post comment count
    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    if (post.userId !== currentUser._id) {
      await ctx.db.insert('notifications', {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: 'comment',
        postId: args.postId,
        commentId,
      });
    }
  },
});


export const getComments = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

      const commentsWithInfo = await Promise.all(
        comments.map(async (comment) => {
          const user = await ctx.db.get(comment.userId);
          return {
            ...comment,
            user: {
              name: user?.fullname,
              image: user?.image,
            },
          };
        })
      );
      return commentsWithInfo;
  },
});
