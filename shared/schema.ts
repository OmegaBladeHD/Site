import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Content schema for streamers
export const streamers = pgTable("streamers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  profileImage: text("profile_image").notNull(),
  bannerImage: text("banner_image").notNull(),
  twitchUsername: text("twitch_username"),
  youtubeChannel: text("youtube_channel"),
  tiktokUsername: text("tiktok_username"),
});

export const insertStreamerSchema = createInsertSchema(streamers).omit({
  id: true,
});

export type InsertStreamer = z.infer<typeof insertStreamerSchema>;
export type Streamer = typeof streamers.$inferSelect;

// Content types
export const contentTypes = {
  TWITCH_STREAM: "TWITCH_STREAM",
  TWITCH_VIDEO: "TWITCH_VIDEO",
  YOUTUBE_VIDEO: "YOUTUBE_VIDEO",
  TIKTOK_VIDEO: "TIKTOK_VIDEO",
} as const;

export type ContentType = typeof contentTypes[keyof typeof contentTypes];

// Content schema
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  streamerId: integer("streamer_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  contentUrl: text("content_url").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  createdAt: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

// Content response schemas
export const twitchStreamSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  game_id: z.string().optional(),
  game_name: z.string().optional(),
  type: z.string(),
  title: z.string(),
  viewer_count: z.number(),
  started_at: z.string(),
  language: z.string(),
  thumbnail_url: z.string(),
  tag_ids: z.array(z.string()).optional(),
  is_mature: z.boolean().optional(),
});

export const twitchVideoSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  title: z.string(),
  description: z.string(),
  created_at: z.string(),
  published_at: z.string(),
  url: z.string(),
  thumbnail_url: z.string(),
  viewable: z.string(),
  view_count: z.number(),
  language: z.string(),
  type: z.string(),
  duration: z.string(),
});

export const youtubeVideoSchema = z.object({
  id: z.object({
    videoId: z.string(),
  }),
  snippet: z.object({
    publishedAt: z.string(),
    channelId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnails: z.object({
      high: z.object({
        url: z.string(),
      }),
    }),
    channelTitle: z.string(),
  }),
});

export const tiktokVideoSchema = z.object({
  id: z.string(),
  desc: z.string(),
  createTime: z.number(),
  video: z.object({
    id: z.string(),
    cover: z.string(),
    playAddr: z.string(),
    downloadAddr: z.string(),
  }),
  author: z.object({
    id: z.string(),
    uniqueId: z.string(),
    nickname: z.string(),
    avatarThumb: z.string(),
  }),
});

export type TwitchStream = z.infer<typeof twitchStreamSchema>;
export type TwitchVideo = z.infer<typeof twitchVideoSchema>;
export type YoutubeVideo = z.infer<typeof youtubeVideoSchema>;
export type TiktokVideo = z.infer<typeof tiktokVideoSchema>;
