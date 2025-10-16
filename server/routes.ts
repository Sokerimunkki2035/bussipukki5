import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTiktokGuessSchema, insertPuzzleScoreSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
