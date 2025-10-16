import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Nut, Brain, Bus } from "lucide-react";
import puzzleImage from "@assets/generated_images/Christmas_puzzle_game_preview_e1d3c0db.png";
import nutImage from "@assets/generated_images/Nut_sorting_game_preview_dc172329.png";
import { PuzzleGame } from "@/components/games/PuzzleGame";
import { NutSortGame } from "@/components/games/NutSortGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { QuizGame } from "@/components/games/QuizGame";
import { Leaderboard } from "@/components/Leaderboard";

export default function Games() {
  const [activeGame, setActiveGame] = useState<"puzzle" | "nut-sort" | "memory" | "quiz" | null>(null);

  if (activeGame === "puzzle") {
    return <PuzzleGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "nut-sort") {
    return <NutSortGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "memory") {
    return <MemoryGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "quiz") {
    return <QuizGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-playful font-bold mb-4 text-foreground">
            Jouluiset Pelit
          </h1>
          <p className="text-xl text-muted-foreground">
            Valitse peli ja haasta itsesi! Kuinka nopeasti pärjäät?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover-elevate transition-transform">
            <CardHeader>
              <div className="w-full h-64 mb-4 rounded-md overflow-hidden">
                <img
                  src={puzzleImage}
                  alt="Joulupalapeli"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="font-playful text-3xl flex items-center gap-2">
                <Puzzle className="w-8 h-8 text-primary" />
                Joulupalapeli
              </CardTitle>
              <CardDescription className="text-base">
                Kokoa jouluinen palapeli mahdollisimman nopeasti! Raahaa palaset
                oikeille paikoilleen ja katso kuinka nopeasti saat sen valmiiksi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setActiveGame("puzzle")}
                data-testid="button-start-puzzle"
              >
                Aloita Palapeli
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-transform">
            <CardHeader>
              <div className="w-full h-64 mb-4 rounded-md overflow-hidden">
                <img
                  src={nutImage}
                  alt="Pähkinälajittelu"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="font-playful text-3xl flex items-center gap-2">
                <Nut className="w-8 h-8 text-primary" />
                Pähkinälajittelu
              </CardTitle>
              <CardDescription className="text-base">
                Lajittele pähkinät oikeisiin lokeroihin! Testaa reaktionopeuttasi
                ja muistiasi tässä hauskassa lajittelupelissä.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setActiveGame("nut-sort")}
                data-testid="button-start-nut-sort"
              >
                Aloita Lajittelu
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-transform">
            <CardHeader>
              <div className="w-full h-64 mb-4 rounded-md overflow-hidden bg-gradient-to-br from-primary/20 to-green-600/20 flex items-center justify-center">
                <Brain className="w-32 h-32 text-primary" />
              </div>
              <CardTitle className="font-playful text-3xl flex items-center gap-2">
                <Brain className="w-8 h-8 text-primary" />
                Muistipeli
              </CardTitle>
              <CardDescription className="text-base">
                Löydä parilliset kortit! Testaa muistiasi ja reaktionopeuttasi
                tässä klassisessa muistipelissä joulutunnelmalla.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setActiveGame("memory")}
                data-testid="button-start-memory"
              >
                Aloita Muistipeli
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-transform">
            <CardHeader>
              <div className="w-full h-64 mb-4 rounded-md overflow-hidden bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                <Bus className="w-32 h-32 text-green-600" />
              </div>
              <CardTitle className="font-playful text-3xl flex items-center gap-2">
                <Bus className="w-8 h-8 text-green-600" />
                Bussitietovisa
              </CardTitle>
              <CardDescription className="text-base">
                Testaa tietosi Porin bussiliikenteestä! Vastaa kysymyksiin
                Porin linjoista ja busseista.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setActiveGame("quiz")}
                data-testid="button-start-quiz"
              >
                Aloita Visa
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-playful font-bold text-center mb-8">
            Parhaat Tulokset
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Leaderboard gameType="puzzle" title="Palapeli - Parhaat Ajat" />
            <Leaderboard gameType="nut-sort" title="Pähkinälajittelu - Parhaat Ajat" />
            <Leaderboard gameType="memory" title="Muistipeli - Parhaat Ajat" />
            <Leaderboard gameType="quiz" title="Bussitietovisa - Parhaat Ajat" />
          </div>
        </div>
      </div>
    </div>
  );
}
