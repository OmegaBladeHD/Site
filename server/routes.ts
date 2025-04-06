import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import puppeteer from "puppeteer";
import { z } from "zod";
import axios from "axios";
import { contentTypes, twitchStreamSchema, twitchVideoSchema, youtubeVideoSchema } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import NodeCache from "node-cache";

// Cache for API responses (10 minutes TTL)
const apiCache = new NodeCache({ stdTTL: 600 });

// Environment variables for API keys
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || "";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";


export async function registerRoutes(app: Express): Promise<Server> {
  // Get Twitch Auth Token
  async function getTwitchAuthToken() {
    const cacheKey = "twitch_auth_token";
    const cachedToken = apiCache.get(cacheKey);

    if (cachedToken) {
      return cachedToken as string;
    }

    try {
      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
      );

      const token = response.data.access_token;
      apiCache.set(cacheKey, token, 3600); // Cache for 1 hour
      return token;
    } catch (error) {
      console.error("Error getting Twitch auth token:", error);
      throw new Error("Failed to get Twitch authentication token");
    }
  }

  // Get all streamers
  app.get("/api/streamers", async (req, res) => {
    try {
      const streamers = await storage.getStreamers();
      res.json(streamers);
    } catch (error) {
      console.error("Error fetching streamers:", error);
      res.status(500).json({ message: "Failed to fetch streamers" });
    }
  });

  // Get a single streamer by slug
  app.get("/api/streamers/:slug", async (req, res) => {
    try {
      const streamer = await storage.getStreamerBySlug(req.params.slug);

      if (!streamer) {
        return res.status(404).json({ message: "Streamer not found" });
      }

      res.json(streamer);
    } catch (error) {
      console.error(`Error fetching streamer ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch streamer" });
    }
  });

  // Get latest Twitch content for a streamer
  app.get("/api/streamers/:slug/twitch", async (req, res) => {
    try {
      const streamer = await storage.getStreamerBySlug(req.params.slug);

      if (!streamer || !streamer.twitchUsername) {
        return res.status(404).json({ message: "Streamer or Twitch username not found" });
      }

      const cacheKey = `twitch_${streamer.twitchUsername}`;
      const cachedData = apiCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      const twitchToken = await getTwitchAuthToken();

      // First check if streamer is live
      const streamsResponse = await axios.get(
        `https://api.twitch.tv/helix/streams?user_login=${streamer.twitchUsername}`,
        {
          headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${twitchToken}`
          }
        }
      );

      // Get the user ID for the streamer
      const usersResponse = await axios.get(
        `https://api.twitch.tv/helix/users?login=${streamer.twitchUsername}`,
        {
          headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${twitchToken}`
          }
        }
      );

      if (!usersResponse.data.data.length) {
        return res.status(404).json({ message: "Twitch user not found" });
      }

      const userId = usersResponse.data.data[0].id;

      if (streamsResponse.data.data.length > 0) {
        // Streamer is live, parse the stream data
        const streamData = twitchStreamSchema.parse(streamsResponse.data.data[0]);

        const content = {
          type: contentTypes.TWITCH_STREAM,
          title: streamData.title,
          description: `🔴 Live now: ${streamData.title}`,
          thumbnailUrl: streamData.thumbnail_url
            .replace('{width}', '440')
            .replace('{height}', '248'),
          contentUrl: `https://twitch.tv/${streamer.twitchUsername}`,
          publishedAt: new Date(streamData.started_at),
          timeAgo: formatDistanceToNow(new Date(streamData.started_at), { addSuffix: true, locale: fr }),
          isLive: true,
          viewerCount: streamData.viewer_count,
          duration: 'EN DIRECT'
        };

        apiCache.set(cacheKey, content);
        return res.json(content);
      }

      // Streamer is not live, get latest video
      const videosResponse = await axios.get(
        `https://api.twitch.tv/helix/videos?user_id=${userId}&first=1`,
        {
          headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${twitchToken}`
          }
        }
      );

      if (videosResponse.data.data.length === 0) {
        return res.status(404).json({ message: "No videos found for this streamer" });
      }

      const videoData = twitchVideoSchema.parse(videosResponse.data.data[0]);

      const content = {
        type: contentTypes.TWITCH_VIDEO,
        title: videoData.title,
        description: videoData.description || videoData.title,
        thumbnailUrl: videoData.thumbnail_url
          .replace('%{width}', '440')
          .replace('%{height}', '248'),
        contentUrl: videoData.url,
        publishedAt: new Date(videoData.published_at),
        timeAgo: formatDistanceToNow(new Date(videoData.published_at), { addSuffix: true, locale: fr }),
        isLive: false,
        viewCount: videoData.view_count
      };

      apiCache.set(cacheKey, content);
      res.json(content);
    } catch (error) {
      console.error(`Error fetching Twitch content for ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch Twitch content" });
    }
  });

  // Get latest YouTube content for a streamer
  app.get("/api/streamers/:slug/youtube", async (req, res) => {
    try {
      const streamer = await storage.getStreamerBySlug(req.params.slug);

      if (!streamer || !streamer.youtubeChannel) {
        return res.status(404).json({ message: "Streamer or YouTube channel not found" });
      }

      const cacheKey = `youtube_${streamer.youtubeChannel}`;
      const cachedData = apiCache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // First get the channel ID from the username
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${streamer.youtubeChannel}&key=${YOUTUBE_API_KEY}`
      );

      let channelId;

      if (channelResponse.data.items && channelResponse.data.items.length > 0) {
        channelId = channelResponse.data.items[0].id;
      } else {
        // Try searching for the channel
        const searchResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(streamer.youtubeChannel)}&type=channel&key=${YOUTUBE_API_KEY}`
        );

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          channelId = searchResponse.data.items[0].id.channelId;
        } else {
          return res.status(404).json({ message: "YouTube channel not found" });
        }
      }

      // Get the latest videos from the channel
      const videosResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&type=video&key=${YOUTUBE_API_KEY}`
      );

      // Get additional video details including duration and stats
      const videoDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videosResponse.data.items[0].id.videoId}&key=${YOUTUBE_API_KEY}`
      );

      const videoDetails = videoDetailsResponse.data.items[0];
      const duration = videoDetails.contentDetails.duration
        .replace('PT', '')
        .replace('H', 'h ')
        .replace('M', 'm ')
        .replace('S', 's');

      if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
        return res.status(404).json({ message: "No videos found for this channel" });
      }

      const videoData = youtubeVideoSchema.parse(videosResponse.data.items[0]);

      const content = {
        type: contentTypes.YOUTUBE_VIDEO,
        title: videoData.snippet.title,
        description: videoData.snippet.description,
        thumbnailUrl: videoData.snippet.thumbnails.high.url,
        contentUrl: `https://www.youtube.com/watch?v=${videoData.id.videoId}`,
        publishedAt: new Date(videoData.snippet.publishedAt),
        timeAgo: formatDistanceToNow(new Date(videoData.snippet.publishedAt), { addSuffix: true, locale: fr }),
        videoId: videoData.id.videoId,
        duration: duration,
        viewCount: parseInt(videoDetails.statistics.viewCount),
        likeCount: parseInt(videoDetails.statistics.likeCount)
      };

      apiCache.set(cacheKey, content);
      res.json(content);
    } catch (error) {
      console.error(`Error fetching YouTube content for ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch YouTube content" });
    }
  });

  // TikTok endpoint removed

  const httpServer = createServer(app);
  return httpServer;
}