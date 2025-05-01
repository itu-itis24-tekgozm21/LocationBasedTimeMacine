import { 
  HistoricalSite, InsertHistoricalSite,
  Story, InsertStory,
  ChatHistoryEntry, InsertChatHistory,
  historicalSites, stories, chatHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Historical Sites
  getAllSites(): Promise<HistoricalSite[]>;
  getSite(id: number): Promise<HistoricalSite | undefined>;
  createSite(site: InsertHistoricalSite): Promise<HistoricalSite>;
  
  // Stories
  getStoriesBySiteId(siteId: number): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // Chat History
  getChatHistory(userId: string): Promise<ChatHistoryEntry[]>;
  saveChatEntry(entry: InsertChatHistory): Promise<ChatHistoryEntry>;
}

export class DatabaseStorage implements IStorage {
  async getAllSites(): Promise<HistoricalSite[]> {
    return await db.select().from(historicalSites);
  }

  async getSite(id: number): Promise<HistoricalSite | undefined> {
    const [site] = await db.select().from(historicalSites).where(eq(historicalSites.id, id));
    return site || undefined;
  }

  async createSite(site: InsertHistoricalSite): Promise<HistoricalSite> {
    const [newSite] = await db.insert(historicalSites).values(site).returning();
    return newSite;
  }

  async getStoriesBySiteId(siteId: number): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.siteId, siteId));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async getChatHistory(userId: string): Promise<ChatHistoryEntry[]> {
    return await db.select()
      .from(chatHistory)
      .where(eq(chatHistory.userId, userId))
      .orderBy(desc(chatHistory.timestamp));
  }

  async saveChatEntry(entry: InsertChatHistory): Promise<ChatHistoryEntry> {
    const [newEntry] = await db.insert(chatHistory).values(entry).returning();
    return newEntry;
  }
}

// Initialize the database with sample data if needed
export class MemStorage implements IStorage {
  private sites: Map<number, HistoricalSite>;
  private stories: Map<number, Story>;
  private chatHistory: Map<string, ChatHistoryEntry[]>;
  private currentSiteId: number;
  private currentStoryId: number;
  private currentChatId: number;

  constructor() {
    this.sites = new Map();
    this.stories = new Map();
    this.chatHistory = new Map();
    this.currentSiteId = 1;
    this.currentStoryId = 1;
    this.currentChatId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleSites: InsertHistoricalSite[] = [
      {
        name: "Ancient Colosseum",
        description: "An iconic amphitheater in Rome",
        location: "Rome, Italy",
        period: "Ancient Roman",
        imageUrls: [
          "https://images.unsplash.com/photo-1597625878683-36a2fa57f545",
          "https://images.unsplash.com/photo-1512711618765-5d3fba47b7fa"
        ],
        coordinates: { lat: 41.8902, lng: 12.4922 },
        yearBuilt: 80
      },
      {
        name: "Taj Mahal",
        description: "A magnificent mausoleum of white marble",
        location: "Agra, India",
        period: "Mughal Empire",
        imageUrls: [
          "https://images.unsplash.com/photo-1740815321246-6a933b8a9e36",
          "https://images.unsplash.com/photo-1740815324564-b8b8f6c85712"
        ],
        coordinates: { lat: 27.1751, lng: 78.0421 },
        yearBuilt: 1653
      }
    ];

    sampleSites.forEach(site => this.createSite(site));
  }

  async getAllSites(): Promise<HistoricalSite[]> {
    return Array.from(this.sites.values());
  }

  async getSite(id: number): Promise<HistoricalSite | undefined> {
    return this.sites.get(id);
  }

  async createSite(site: InsertHistoricalSite): Promise<HistoricalSite> {
    const id = this.currentSiteId++;
    const newSite = { ...site, id };
    this.sites.set(id, newSite);
    return newSite;
  }

  async getStoriesBySiteId(siteId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.siteId === siteId);
  }

  async createStory(story: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const newStory = { ...story, id };
    this.stories.set(id, newStory);
    return newStory;
  }

  async getChatHistory(userId: string): Promise<ChatHistoryEntry[]> {
    return this.chatHistory.get(userId) || [];
  }

  async saveChatEntry(entry: InsertChatHistory): Promise<ChatHistoryEntry> {
    const id = this.currentChatId++;
    const timestamp = new Date();
    const newEntry = { ...entry, id, timestamp };
    
    const userHistory = this.chatHistory.get(entry.userId) || [];
    userHistory.push(newEntry);
    this.chatHistory.set(entry.userId, userHistory);
    
    return newEntry;
  }
}

// Use the in-memory storage implementation for development
export const storage = new MemStorage();
