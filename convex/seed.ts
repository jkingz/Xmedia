import { mutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

// Seed users data
export const seedUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have users to avoid duplicate seeding
    const existingUsers = await ctx.db.query('users').collect();
    if (existingUsers.length > 0) {
      return { message: 'Database already has users, skipping seed' };
    }

    const users = [
      {
        username: 'johndoe',
        fullname: 'John Doe',
        email: 'john@example.com',
        bio: 'Photography enthusiast and travel lover',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        followers: 0,
        following: 0,
        posts: 0,
        likes: 0,
        clerkId: 'user_john123', // Replace with actual Clerk IDs in production
      },
      {
        username: 'janedoe',
        fullname: 'Jane Doe',
        email: 'jane@example.com',
        bio: 'Digital artist and coffee addict',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        followers: 0,
        following: 0,
        posts: 0,
        likes: 0,
        clerkId: 'user_jane456', // Replace with actual Clerk IDs in production
      },
      {
        username: 'mike_smith',
        fullname: 'Mike Smith',
        email: 'mike@example.com',
        bio: 'Software developer and hiking enthusiast',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        followers: 0,
        following: 0,
        posts: 0,
        likes: 0,
        clerkId: 'user_mike789', // Replace with actual Clerk IDs in production
      },
    ];

    const userIds = [];
    for (const user of users) {
      const userId = await ctx.db.insert('users', user);
      userIds.push(userId);
    }

    return { message: `Created ${userIds.length} users`, userIds };
  },
});

// Seed posts data (requires users to exist first)
// export const seedPosts = mutation({
//   args: {},
//   handler: async (ctx) => {
//     // Get existing users
//     const users = await ctx.db.query('users').collect();
//     if (users.length === 0) {
//       return { message: 'No users found. Please run seedUsers first.' };
//     }

//     // Check if we already have posts
//     const existingPosts = await ctx.db.query('posts').collect();
//     if (existingPosts.length > 0) {
//       return { message: 'Database already has posts, skipping seed' };
//     }

//     // Mock posts data
//     // Note: In a real implementation, you would need to upload images to storage
//     // and get storageIds. This is simplified for demonstration.
//     const posts = [
//       {
//         userId: users[0]._id,
//         storageId: 'placeholder_storage_id_1', // This would be a real storage ID in production
//         imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//         caption: 'Beautiful sunset at the beach #nature #sunset',
//         likes: 0,
//         comments: 0,
//       },
//       {
//         userId: users[1]._id,
//         storageId: 'placeholder_storage_id_2',
//         imageUrl: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//         caption: 'Coffee and code, perfect morning ☕️ #coding #coffee',
//         likes: 0,
//         comments: 0,
//       },
//       {
//         userId: users[2]._id,
//         storageId: 'placeholder_storage_id_3',
//         imageUrl: 'https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
//         caption: 'Hiking trip with friends #adventure #mountains',
//         likes: 0,
//         comments: 0,
//       },
//     ];

//     const postIds = [];
//     for (const post of posts) {
//       const postId = await ctx.db.insert('posts', post);
//       postIds.push(postId);

//       // Update user's post count
//       const user = await ctx.db.get(post.userId);
//       if (user) {
//         await ctx.db.patch(post.userId, {
//           posts: user.posts + 1,
//         });
//       }
//     }

//     return { message: `Created ${postIds.length} posts`, postIds };
//   },
// });

// Seed followers relationships
// export const seedFollowers = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const users = await ctx.db.query('users').collect();
//     if (users.length < 3) {
//       return { message: 'Not enough users for follower relationships. Please run seedUsers first.' };
//     }

//     // Check if we already have follower relationships
//     const existingFollowers = await ctx.db.query('followers').collect();
//     if (existingFollowers.length > 0) {
//       return { message: 'Database already has follower relationships, skipping seed' };
//     }

//     // Create some follower relationships
//     const relationships = [
//       { followerId: users[0]._id, followingId: users[1]._id }, // User 0 follows User 1
//       { followerId: users[0]._id, followingId: users[2]._id }, // User 0 follows User 2
//       { followerId: users[1]._id, followingId: users[0]._id }, // User 1 follows User 0
//       { followerId: users[2]._id, followingId: users[0]._id }, // User 2 follows User 0
//     ];

//     const followerIds = [];
//     for (const relationship of relationships) {
//       const followerId = await ctx.db.insert('followers', relationship);
//       followerIds.push(followerId);

//       // Update follower counts
//       const follower = await ctx.db.get(relationship.followerId);
//       const following = await ctx.db.get(relationship.followingId);

//       if (follower) {
//         await ctx.db.patch(relationship.followerId, {
//           following: follower.following + 1,
//         });
//       }

//       if (following) {
//         await ctx.db.patch(relationship.followingId, {
//           followers: following.followers + 1,
//         });
//       }
//     }

//     return { message: `Created ${followerIds.length} follower relationships`, followerIds };
//   },
// });

