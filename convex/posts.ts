import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // get current user
    const currentUser = await getAuthenticatedUser(ctx);
    // get image url
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error('Image not found');
    }

    // create post
    const postId = await ctx.db.insert('posts', {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    //increment user's posts by 1
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const feedPosts = mutation({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // get all posts
    const query = ctx.db.query('posts').order('desc');
    const posts = await query.collect();
    // post length
    if (posts.length === 0) {
      return [];
    }

    // Enhance posts with user info and interactions
    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = await ctx.db.get(post.userId);
        const isLiked = await ctx.db
          .query('likes')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id),
          )
          .first();
        const bookmarks = await ctx.db
          .query('bookmarks')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id),
          )
          .first();
        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
          },
          isLiked: !!isLiked,
          isBookmarked: !!bookmarks,
        };
      }),
    );

    return postsWithInfo;
  },
});
