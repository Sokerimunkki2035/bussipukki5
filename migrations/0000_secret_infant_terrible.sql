CREATE TABLE "puzzle_scores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_name" text NOT NULL,
	"time_seconds" integer NOT NULL,
	"game_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tiktok_guesses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_name" text NOT NULL,
	"guessed_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
