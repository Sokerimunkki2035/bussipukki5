import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Trophy } from "lucide-react";
import { format } from "date-fns";
import type { TiktokGuess } from "@shared/schema";

export default function Admin() {
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: guesses, isLoading, refetch } = useQuery<TiktokGuess[]>({
    queryKey: ["/api/tiktok-guesses"],
    refetchInterval: autoRefresh ? 5000 : false,
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-playful font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Näe kaikki TikTok live arvaukset
          </p>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-primary/10 to-[hsl(45,95%,55%)]/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-playful mb-2">
                  TikTok Arvaukset
                </CardTitle>
                <CardDescription>
                  Kaikki katsojien arvaukset yhdessä paikassa
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  data-testid="button-auto-refresh"
                  className={autoRefresh ? "bg-primary/10" : ""}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
                  />
                  {autoRefresh ? "Päivittyy..." : "Auto-päivitys"}
                </Button>
                <Button
                  onClick={() => refetch()}
                  data-testid="button-manual-refresh"
                >
                  Päivitä
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Ladataan arvauksia...</p>
              </div>
            ) : !guesses || guesses.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold text-muted-foreground mb-2">
                  Ei vielä arvauksia
                </p>
                <p className="text-sm text-muted-foreground">
                  Arvaukset näkyvät täällä kun katsojat lähettävät niitä
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Yhteensä arvauksia
                      </p>
                      <p
                        className="text-3xl font-bold text-primary"
                        data-testid="text-total-guesses"
                      >
                        {guesses.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Keskiarvo
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {(
                          guesses.reduce((sum: number, g: any) => sum + g.guessedNumber, 0) /
                          guesses.length
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pienin
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {Math.min(...guesses.map((g: any) => g.guessedNumber))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Suurin
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {Math.max(...guesses.map((g: any) => g.guessedNumber))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left p-3 font-semibold">Pelaaja</th>
                        <th className="text-left p-3 font-semibold">Arvaus</th>
                        <th className="text-left p-3 font-semibold">Aika</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guesses.map((guess: any, index: number) => (
                        <tr
                          key={guess.id}
                          className="border-b border-border hover-elevate"
                          data-testid={`guess-row-${index}`}
                        >
                          <td className="p-3 font-medium" data-testid={`guess-player-${index}`}>
                            {guess.playerName}
                          </td>
                          <td className="p-3">
                            <span
                              className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-bold"
                              data-testid={`guess-number-${index}`}
                            >
                              {guess.guessedNumber}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {guess.createdAt
                              ? format(new Date(guess.createdAt), "dd.MM.yyyy HH:mm")
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
