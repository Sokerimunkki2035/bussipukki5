import { type TiktokGuess, type InsertTiktokGuess, type PuzzleScore, type InsertPuzzleScore, tiktokGuesses, puzzleScores } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { desc, asc, eq } from "drizzle-orm";
import ws from "ws";

export interface IStorage {
  createTiktokGuess(guess: InsertTiktokGuess): Promise<TiktokGuess>;
  getAllTiktokGuesses(): Promise<TiktokGuess[]>;
  createPuzzleScore(score: InsertPuzzleScore): Promise<PuzzleScore>;
  getTopPuzzleScores(gameType: string, limit: number): Promise<PuzzleScore[]>;
}

export class MemStorage implements IStorage {
  private tiktokGuesses: Map<string, TiktokGuess>;
  private puzzleScores: Map<string, PuzzleScore>;

  constructor() {
    this.tiktokGuesses = new Map();
    this.puzzleScores = new Map();
  }

  async createTiktokGuess(insertGuess: InsertTiktokGuess): Promise<TiktokGuess> {
    const id = randomUUID();
    const guess: TiktokGuess = {
      ...insertGuess,
      id,
      createdAt: new Date(),
    };
    this.tiktokGuesses.set(id, guess);
    return guess;
  }

  async getAllTiktokGuesses(): Promise<TiktokGuess[]> {
    return Array.from(this.tiktokGuesses.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createPuzzleScore(insertScore: InsertPuzzleScore): Promise<PuzzleScore> {
    const id = randomUUID();
    const score: PuzzleScore = {
      ...insertScore,
      id,
      createdAt: new Date(),
    };
    this.puzzleScores.set(id, score);
    return score;
  }

  async getTopPuzzleScores(gameType: string, limit: number): Promise<PuzzleScore[]> {
    return Array.from(this.puzzleScores.values())
      .filter((score) => score.gameType === gameType)
      .sort((a, b) => a.timeSeconds - b.timeSeconds)
      .slice(0, limit);
  }
}

// PostgreSQL Storage using Neon for Vercel deployment
export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }

    // Configure for serverless - use WebSocket only in production
    // In development, use HTTP to avoid SSL certificate issues
    if (process.env.NODE_ENV !== 'development') {
      neonConfig.webSocketConstructor = ws;
    } else {
      // In development, use fetchConnectionCache for HTTP
      neonConfig.fetchConnectionCache = true;
    }
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async createTiktokGuess(insertGuess: InsertTiktokGuess): Promise<TiktokGuess> {
    const [guess] = await this.db
      .insert(tiktokGuesses)
      .values(insertGuess)
      .returning();
    return guess;
  }

  async getAllTiktokGuesses(): Promise<TiktokGuess[]> {
    return await this.db
      .select()
      .from(tiktokGuesses)
      .orderBy(desc(tiktokGuesses.createdAt));
  }

  async createPuzzleScore(insertScore: InsertPuzzleScore): Promise<PuzzleScore> {
    const [score] = await this.db
      .insert(puzzleScores)
      .values(insertScore)
      .returning();
    return score;
  }

  async getTopPuzzleScores(gameType: string, limit: number): Promise<PuzzleScore[]> {
    return await this.db
      .select()
      .from(puzzleScores)
      .where(eq(puzzleScores.gameType, gameType))
      .orderBy(asc(puzzleScores.timeSeconds))
      .limit(limit);
  }
}

// Use MemStorage in development, PostgreSQL in production
export const storage = process.env.NODE_ENV === 'development'
  ? new MemStorage()
  : process.env.DATABASE_URL 
    ? new PostgresStorage() 
    : new MemStorage();
