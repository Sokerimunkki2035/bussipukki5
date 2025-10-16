import { type TiktokGuess, type InsertTiktokGuess, type PuzzleScore, type InsertPuzzleScore } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
