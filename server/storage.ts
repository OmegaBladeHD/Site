import { contents, type Content, type InsertContent, streamers, type Streamer, type InsertStreamer, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods (keeping the existing ones)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Streamer methods
  getStreamers(): Promise<Streamer[]>;
  getStreamerBySlug(slug: string): Promise<Streamer | undefined>;
  createStreamer(streamer: InsertStreamer): Promise<Streamer>;

  // Content methods
  getLatestContent(streamerId: number, type?: string): Promise<Content | undefined>;
  saveContent(content: InsertContent): Promise<Content>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private streamers: Map<number, Streamer>;
  private contents: Map<number, Content>;
  private userCurrentId: number;
  private streamerCurrentId: number;
  private contentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.streamers = new Map();
    this.contents = new Map();
    this.userCurrentId = 1;
    this.streamerCurrentId = 1;
    this.contentCurrentId = 1;

    // Initialize with streamer data
    this.initializeData();
  }

  private initializeData() {
    // Add Tayomi20
    const tayomi: InsertStreamer = {
      name: "Tayomi20",
      slug: "tayomi20",
      description: "Streamer déjanté avec un humour noir et décalé qui aime partager sa passion pour les jeux d'aventure et FPS. Spécialisé dans Hollow Knight, Call of Duty et Fortnite, il n'hésite pas à tenter de nouveaux défis et à interagir avec sa communauté. Amateur de speedrun et de compétition, ses streams sont toujours remplis d'action et de moments mémorables.",
      profileImage: "https://creatorhubtz.s-ul.eu/YzZelHjY",
      bannerImage: "https://creatorhubtz.s-ul.eu/xDA2KVkP",
      twitchUsername: "tayomi20",
      tiktokUsername: "tayomi_20",
    };
    this.createStreamer(tayomi);

    // Add Zeyphir
    const zeyphir: InsertStreamer = {
      name: "Zeyphir",
      slug: "zeyphir", 
      description: "Tout pour l'argent! 🐀 Expert en Rocket League, GTA V et Minecraft, Zeyphir est connu pour son style de jeu unique et son humour noir décalé. Maître dans l'art du trading et des combines sur GTA V, il partage ses techniques pour devenir riche dans les jeux. Fan de compétition sur Rocket League et créateur de contenu varié sur Minecraft et Fortnite, ses streams sont un mélange parfait d'entertainment et de gameplay de haut niveau.",
      profileImage: "https://creatorhubtz.s-ul.eu/9JzlVnFB",
      bannerImage: "https://creatorhubtz.s-ul.eu/jMNgQY9I",
      twitchUsername: "zayphir_",
      youtubeChannel: "Zeyphir_Officiel",
      tiktokUsername: "1Gars.Random",
    };
    this.createStreamer(zeyphir);
  }

  // User methods (keeping the existing ones)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Streamer methods
  async getStreamers(): Promise<Streamer[]> {
    return Array.from(this.streamers.values());
  }

  async getStreamerBySlug(slug: string): Promise<Streamer | undefined> {
    return Array.from(this.streamers.values()).find(
      (streamer) => streamer.slug === slug,
    );
  }

  async createStreamer(insertStreamer: InsertStreamer): Promise<Streamer> {
    const id = this.streamerCurrentId++;
    const streamer: Streamer = { ...insertStreamer, id };
    this.streamers.set(id, streamer);
    return streamer;
  }

  // Content methods
  async getLatestContent(streamerId: number, type?: string): Promise<Content | undefined> {
    const streamerContents = Array.from(this.contents.values())
      .filter(content => content.streamerId === streamerId)
      .filter(content => type ? content.type === type : true)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return streamerContents[0];
  }

  async saveContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentCurrentId++;
    const content: Content = { 
      ...insertContent, 
      id,
      createdAt: new Date()
    };
    this.contents.set(id, content);
    return content;
  }
}

export const storage = new MemStorage();