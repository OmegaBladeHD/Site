import { Streamer, Content } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Fetch all streamers
export async function getStreamers(): Promise<Streamer[]> {
  const res = await apiRequest("GET", "/api/streamers");
  return await res.json();
}

// Fetch a single streamer by slug
export async function getStreamer(slug: string): Promise<Streamer> {
  const res = await apiRequest("GET", `/api/streamers/${slug}`);
  return await res.json();
}

// Fetch Twitch content for a streamer
export async function getTwitchContent(slug: string): Promise<Content & { isLive?: boolean, timeAgo: string, viewerCount?: number }> {
  const res = await apiRequest("GET", `/api/streamers/${slug}/twitch`);
  return await res.json();
}

// Fetch YouTube content for a streamer
export async function getYoutubeContent(slug: string): Promise<Content & { timeAgo: string, videoId: string }> {
  const res = await apiRequest("GET", `/api/streamers/${slug}/youtube`);
  return await res.json();
}

// Fetch TikTok content for a streamer
export async function getTiktokContent(slug: string): Promise<Content & { timeAgo: string }> {
  const res = await apiRequest("GET", `/api/streamers/${slug}/tiktok`);
  return await res.json();
}
