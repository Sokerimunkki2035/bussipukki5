import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTiktokGuessSchema, insertPuzzleScoreSchema } from "@shared/schema";
import { PrintfulClient } from "printful-request";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tiktok-guesses", async (_req, res) => {
    try {
      const guesses = await storage.getAllTiktokGuesses();
      res.json(guesses);
    } catch (error) {
      console.error("Error fetching TikTok guesses:", error);
      res.status(500).json({ message: "Failed to fetch guesses" });
    }
  });

  app.post("/api/tiktok-guesses", async (req, res) => {
    try {
      const validatedData = insertTiktokGuessSchema.parse(req.body);
      const guess = await storage.createTiktokGuess(validatedData);
      res.status(201).json(guess);
    } catch (error) {
      console.error("Error creating TikTok guess:", error);
      res.status(400).json({ message: "Invalid guess data" });
    }
  });

  app.post("/api/puzzle-scores", async (req, res) => {
    try {
      const validatedData = insertPuzzleScoreSchema.parse(req.body);
      const score = await storage.createPuzzleScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      console.error("Error creating puzzle score:", error);
      res.status(400).json({ message: "Invalid score data" });
    }
  });

  app.get("/api/puzzle-scores/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const scores = await storage.getTopPuzzleScores(gameType, limit);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching puzzle scores:", error);
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  app.get("/api/printful/store-products", async (_req, res) => {
    try {
      const token = process.env.PRINTFUL_API_TOKEN;
      
      if (!token) {
        return res.status(500).json({ 
          message: "Printful API token not configured" 
        });
      }

      const printful = new PrintfulClient(token);
      const response = await printful.get("store/products");
      
      res.json(response.result || []);
    } catch (error) {
      console.error("Error fetching Printful products:", error);
      res.status(500).json({ 
        message: "Failed to fetch products from Printful",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/printful/products", async (_req, res) => {
    try {
      const token = process.env.PRINTFUL_API_TOKEN;
      
      if (!token) {
        return res.status(500).json({ 
          message: "Printful API token not configured" 
        });
      }

      const printful = new PrintfulClient(token);
      const response = await printful.get("products");
      
      res.json(response.result || []);
    } catch (error) {
      console.error("Error fetching Printful catalog:", error);
      res.status(500).json({ 
        message: "Failed to fetch catalog from Printful",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
