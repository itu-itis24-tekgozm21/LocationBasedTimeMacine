import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHistoricalResponse, generateStorytellingContent } from "./openai";
import { insertHistoricalSiteSchema, insertStorySchema, insertChatHistorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Historical Sites endpoints
  app.get("/api/sites", async (_req, res) => {
    try {
      const sites = await storage.getAllSites();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch historical sites" });
    }
  });

  app.get("/api/sites/:id", async (req, res) => {
    try {
      const site = await storage.getSite(parseInt(req.params.id));
      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }
      res.json(site);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site details" });
    }
  });

  // Stories endpoints
  app.get("/api/sites/:siteId/stories", async (req, res) => {
    try {
      const stories = await storage.getStoriesBySiteId(parseInt(req.params.siteId));
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.post("/api/sites/:siteId/stories", async (req, res) => {
    try {
      const siteId = parseInt(req.params.siteId);
      const site = await storage.getSite(siteId);
      if (!site) {
        return res.status(404).json({ message: "Site not found" });
      }

      const storyContent = await generateStorytellingContent(site.name, site.period);
      const storyData = insertStorySchema.parse({
        siteId,
        ...storyContent,
        mediaUrls: [],
        author: "AI Storyteller"
      });

      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate story" });
    }
  });

  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { userId, message } = req.body;
      const { text: responseText, audioUrl } = await generateHistoricalResponse(message);
      
      const chatEntry = insertChatHistorySchema.parse({
        userId,
        message,
        response: responseText,
        audioUrl
      });

      const savedEntry = await storage.saveChatEntry(chatEntry);
      res.json(savedEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/:userId/history", async (req, res) => {
    try {
      const history = await storage.getChatHistory(req.params.userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
