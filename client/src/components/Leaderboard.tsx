import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import type { PuzzleScore } from "@shared/schema";

interface LeaderboardProps {
  gameType: string;
  title: string;
}

export function Leaderboard({ gameType, title }: LeaderboardProps) {
  const { data: scores, isLoading } = useQuery<PuzzleScore[]>({
    queryKey: ["/api/puzzle-scores", gameType],
    queryFn: async () => {
      const response = await fetch(`/api/puzzle-scores/${gameType}?limit=10`);
      if (!response.ok) throw new Error("Failed to fetch scores");
      return response.json();
    },
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5" style={{ color: 'hsl(var(--chart-3))' }} />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5" style={{ color: 'hsl(var(--chart-4))' }} />;
    return null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playful text-2xl flex items-center gap-2">
          <Trophy className="w-6 h-6" style={{ color: 'hsl(var(--chart-3))' }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : scores && scores.length > 0 ? (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-3 rounded-md bg-card border hover-elevate transition-all"
                data-testid={`leaderboard-entry-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index) || (
                      <span className="text-sm font-semibold text-muted-foreground">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    {score.playerName}
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  {formatTime(score.timeSeconds)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Ei vielä tuloksia. Ole ensimmäinen!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
