import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tiktokGuesses = pgTable("tiktok_guesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  guessedNumber: integer("guessed_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTiktokGuessSchema = createInsertSchema(tiktokGuesses).omit({
  id: true,
  createdAt: true,
});

export type InsertTiktokGuess = z.infer<typeof insertTiktokGuessSchema>;
export type TiktokGuess = typeof tiktokGuesses.$inferSelect;

export const puzzleScores = pgTable("puzzle_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  timeSeconds: integer("time_seconds").notNull(),
  gameType: text("game_type").notNull(), // 'puzzle', 'nut-sort', 'memory', or 'quiz'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPuzzleScoreSchema = createInsertSchema(puzzleScores)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    gameType: z.enum(["puzzle", "nut-sort", "memory", "quiz"]),
  });

export type InsertPuzzleScore = z.infer<typeof insertPuzzleScoreSchema>;
export type PuzzleScore = typeof puzzleScores.$inferSelect;

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}
