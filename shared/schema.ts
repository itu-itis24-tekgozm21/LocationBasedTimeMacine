import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const historicalSites = pgTable("historical_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  period: text("period").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  coordinates: jsonb("coordinates").notNull(),
  yearBuilt: integer("year_built"),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(),
  author: text("author").notNull(),
});

export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  audioUrl: text("audio_url"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertHistoricalSiteSchema = createInsertSchema(historicalSites).omit({ 
  id: true 
});

export const insertStorySchema = createInsertSchema(stories).omit({ 
  id: true 
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({ 
  id: true,
  timestamp: true 
});

export type InsertHistoricalSite = z.infer<typeof insertHistoricalSiteSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;

export type HistoricalSite = typeof historicalSites.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type ChatHistoryEntry = typeof chatHistory.$inferSelect;
