import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User table
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    likes: v.number(),
    clerkId: v.string(),
  }).index('by_clerkId', ['clerkId']),

  // Posts table
  posts: defineTable({
    userId: v.id('users'),
    storageId: v.id('_storage'),
    imageUrl: v.string(),
    caption: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
  }).index('by_user', ['userId']),

  // Likes table
  likes: defineTable({
    userId: v.id('users'),
    postId: v.id('posts'),
  }).index('by_user', ['userId']).index('by_post', ['postId']),

  // Comments table
  comments: defineTable({
    userId: v.id('users'),
    postId: v.id('posts'),
    content: v.string(),
  }).index('by_post', ['postId']),

  // Followers table
  followers: defineTable({
    followerId: v.id('users'),
    followingId: v.id('users'),
  }).index('by_follower', ['followerId'])
    .index('by_following', ['followingId'])
    .index('by_both', ['followerId', 'followingId']),

  // Notifications table
  notifications: defineTable({
    receiverId: v.id('users'),
    senderId: v.id('users'),
    type: v.union(
      v.literal('follow'),
      v.literal('like'),
      v.literal('comment'),
    ),
    postId: v.id('posts'),
    commentId: v.id('comments'),
  }).index('by_receiver', ['receiverId']),

  // Bookmarks table
  bookmarks: defineTable({
    userId: v.id('users'),
    postId: v.id('posts'),
  }).index('by_user_and_post', ['userId', 'postId']),

})
