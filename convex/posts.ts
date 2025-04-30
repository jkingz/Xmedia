import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
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

export const feedPosts = query({
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
        const postAuthor = (await ctx.db.get(post.userId))!;
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

export const toggleLiked = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId),
      )
      .first();
    const post = await ctx.db.get(args.postId);
    if (!post) throw Error('Post not found');

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likes: post.likes - 1,
      });
      return false;
    } else {
      await ctx.db.insert('likes', {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(args.postId, {
        likes: post.likes + 1,
      });

      // if it is not my post create notification
      if (currentUser._id !== post.userId) {
        await ctx.db.insert('notifications', {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: 'like',
          postId: args.postId,
        });
      }
      return true;
    }
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    console.log(post);
    if (!post) throw Error('Post not found');

    if (currentUser._id !== post.userId) throw new ConvexError('Unauthorized');

    await ctx.db.delete(args.postId);
  },
});
