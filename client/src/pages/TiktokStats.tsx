import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { TiktokGuess } from "@shared/schema";

export default function TiktokStats() {
  const { data: guesses, isLoading } = useQuery<TiktokGuess[]>({
    queryKey: ["/api/tiktok-guesses"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-playful font-bold mb-8 text-foreground">
            TikTok Tilastot
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded-md animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = guesses
    ? {
        total: guesses.length,
        average: guesses.length > 0
          ? Math.round(
              guesses.reduce((sum, g) => sum + g.guessedNumber, 0) / guesses.length
            )
          : 0,
        min: guesses.length > 0
          ? Math.min(...guesses.map((g) => g.guessedNumber))
          : 0,
        max: guesses.length > 0
          ? Math.max(...guesses.map((g) => g.guessedNumber))
          : 0,
        uniquePlayers: guesses.length > 0
          ? new Set(guesses.map((g) => g.playerName)).size
          : 0,
        latestDate: guesses.length > 0
          ? new Date(Math.max(...guesses.map((g) => new Date(g.createdAt).getTime())))
          : null,
        earliestDate: guesses.length > 0
          ? new Date(Math.min(...guesses.map((g) => new Date(g.createdAt).getTime())))
          : null,
      }
    : { total: 0, average: 0, min: 0, max: 0, uniquePlayers: 0, latestDate: null, earliestDate: null };

  const guessDistribution = guesses
    ? guesses.reduce((acc, guess) => {
        const num = guess.guessedNumber;
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    : {};

  const sortedDistribution = Object.entries(guessDistribution)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10);

  const maxCount = Math.max(...Object.values(guessDistribution), 1);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-playful font-bold mb-4 text-foreground">
            TikTok Live Tilastot
          </h1>
          <p className="text-xl text-muted-foreground">
            Katso kaikkien TikTok live -arvausten tilastot ja trendit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arvauksia Yhteensä</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.uniquePlayers} eri pelaajaa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Keskiarvo</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.average}</div>
              <p className="text-xs text-muted-foreground mt-1">
                vitsien määrä
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alue</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.min} - {stats.max}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                pienin ja suurin arvaus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aikaväli</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-primary">
                {stats.earliestDate && stats.latestDate
                  ? `${format(stats.earliestDate, "dd.MM")} - ${format(stats.latestDate, "dd.MM")}`
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ensimmäinen - viimeisin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suosituimmat</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {sortedDistribution.length > 0
                  ? sortedDistribution.reduce((a, b) => (b[1] > a[1] ? b : a))[0]
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                eniten arvattu numero
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eri Numeroita</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Object.keys(guessDistribution).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                erilaista arvausta
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-playful text-2xl">Arvausten Jakauma</CardTitle>
            <CardDescription>Top 10 suosituinta arvausta</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedDistribution.length > 0 ? (
              <div className="space-y-3">
                {sortedDistribution.map(([number, count]) => (
                  <div key={number} className="flex items-center gap-4">
                    <span className="font-semibold text-lg w-12 text-primary">
                      {number}
                    </span>
                    <div className="flex-1">
                      <div className="relative h-8 bg-muted rounded-md overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary transition-all"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-sm font-medium text-foreground">
                          {count} arvaus{count !== 1 ? "ta" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Ei vielä arvauksia. Ole ensimmäinen!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
