import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom scoring rules for games
const CUSTOM_GAME_SCORES: Record<string, number> = {
  alangkar: 10,
  "social media": 10,
  "photo contest": 10,
  carrom: 15,
  chess: 15,
  rangoli: 10,
  "treasure hunt": 10,
};

/**
 * Calculates the total score for a team based on custom rules:
 * - Custom scores for specific games
 * - 5 points for all other games
 * - Total capped at 100
 */
export function calculateTeamTotal(games: Record<string, number>): number {
  let total = 0;
  for (const [game, value] of Object.entries(games)) {
    const key = game.trim().toLowerCase();
    const max = CUSTOM_GAME_SCORES.hasOwnProperty(key)
      ? CUSTOM_GAME_SCORES[key]
      : 5;
    total += Math.min(value, max); // sum the actual score, capped at max
  }
  return Math.min(total, 100);
}
