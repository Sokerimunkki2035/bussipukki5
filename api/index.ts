import express, { type Request, Response, NextFunction } from "express";
import { tiktokGuesses, puzzleScores, insertTiktokGuessSchema, insertPuzzleScoreSchema } from "../shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { desc, asc, eq } from "drizzle-orm";
import { PrintfulClient } from "printful-request";
import ws from "ws";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure Neon for serverless  
neonConfig.webSocketConstructor = ws;

// Lazy database connection (cached per serverless instance)
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      return null; // Gracefully return null instead of throwing
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    dbInstance = drizzle(pool);
  }
  return dbInstance;
}

// TikTok Guesses routes
app.get("/api/tiktok-guesses", async (_req, res) => {
  try {
    const database = getDb();
    if (!database) {
      return res.status(500).json({ message: "Database not configured" });
    }
    
    const guesses = await database
      .select()
      .from(tiktokGuesses)
      .orderBy(desc(tiktokGuesses.createdAt));
    res.json(guesses);
  } catch (error) {
    console.error("Error fetching TikTok guesses:", error);
    res.status(500).json({ message: "Failed to fetch guesses" });
  }
});

app.post("/api/tiktok-guesses", async (req, res) => {
  try {
    const database = getDb();
    if (!database) {
      return res.status(500).json({ message: "Database not configured" });
    }
    
    const validatedData = insertTiktokGuessSchema.parse(req.body);
    const [guess] = await database
      .insert(tiktokGuesses)
      .values(validatedData)
      .returning();
    res.status(201).json(guess);
  } catch (error) {
    console.error("Error creating TikTok guess:", error);
    res.status(400).json({ message: "Invalid guess data" });
  }
});

// Puzzle Scores routes
app.post("/api/puzzle-scores", async (req, res) => {
  try {
    const database = getDb();
    if (!database) {
      return res.status(500).json({ message: "Database not configured" });
    }
    
    const validatedData = insertPuzzleScoreSchema.parse(req.body);
    const [score] = await database
      .insert(puzzleScores)
      .values(validatedData)
      .returning();
    res.status(201).json(score);
  } catch (error) {
    console.error("Error creating puzzle score:", error);
    res.status(400).json({ message: "Invalid score data" });
  }
});

app.get("/api/puzzle-scores/:gameType", async (req, res) => {
  try {
    const database = getDb();
    if (!database) {
      return res.status(500).json({ message: "Database not configured" });
    }
    
    const { gameType } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const scores = await database
      .select()
      .from(puzzleScores)
      .where(eq(puzzleScores.gameType, gameType))
      .orderBy(asc(puzzleScores.timeSeconds))
      .limit(limit);
    res.json(scores);
  } catch (error) {
    console.error("Error fetching puzzle scores:", error);
    res.status(500).json({ message: "Failed to fetch scores" });
  }
});

// Printful routes
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

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export handler for Vercel serverless (Node.js runtime)
export default app;
