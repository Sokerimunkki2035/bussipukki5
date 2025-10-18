import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, RotateCcw, Bolt, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { ShareButtons } from "@/components/ShareButtons";
import bussipukkiBg from "@assets/generated_images/Bussipukki_Christmas_bus_background_282a718b.png";

interface NutSortGameProps {
  onBack: () => void;
}

interface BoltItem {
  id: number;
  type: "red" | "green" | "gold" | "white";
  sorted: boolean;
}

const boltTypes = ["red", "green", "gold", "white"] as const;
const boltColors = {
  red: "text-primary",
  green: "text-green-600",
  gold: "text-yellow-500",
  white: "text-slate-100",
};
const boltNames = {
  red: "Punainen ruuvi",
  green: "Vihreä ruuvi",
  gold: "Kultainen ruuvi",
  white: "Valkoinen ruuvi",
};

const GAME_TIME = 60; // 60 seconds countdown

export function NutSortGame({ onBack }: NutSortGameProps) {
  const [bolts, setBolts] = useState<BoltItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<typeof boltTypes[number]>("red");
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const { toast } = useToast();

  const saveScoreMutation = useMutation({
    mutationFn: async (data: { playerName: string; timeSeconds: number; gameType: string }) => {
      return await apiRequest("POST", "/api/puzzle-scores", data);
    },
    onSuccess: () => {
      setScoreSaved(true);
      toast({
        title: "Pisteet tallennettu!",
        description: `${playerName}, aikasi ${GAME_TIME - timeLeft} sekuntia on nyt tallennettu.`,
      });
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Pisteiden tallentaminen epäonnistui.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isComplete && !gameOver && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            toast({
              title: "Aika loppui!",
              description: "Yritä uudelleen ja ole nopeampi!",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete, gameOver, timeLeft]);

  const initializeGame = () => {
    const newBolts: BoltItem[] = [];
    const boltsPerType = 3;
    
    boltTypes.forEach((type) => {
      for (let i = 0; i < boltsPerType; i++) {
        newBolts.push({
          id: newBolts.length,
          type,
          sorted: false,
        });
      }
    });

    for (let i = newBolts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newBolts[i], newBolts[j]] = [newBolts[j], newBolts[i]];
    }

    setBolts(newBolts);
    setTimeLeft(GAME_TIME);
    setIsPlaying(false);
    setIsComplete(false);
    setGameOver(false);
    setCurrentTarget("red");
    setScoreSaved(false);
  };

  const handleSaveScore = () => {
    if (!playerName.trim()) {
      toast({
        title: "Virhe",
        description: "Syötä nimesi tallentaaksesi pisteet",
        variant: "destructive",
      });
      return;
    }
    const finalTime = GAME_TIME - timeLeft;
    saveScoreMutation.mutate({
      playerName,
      timeSeconds: finalTime,
      gameType: "nut-sort",
    });
  };

  const handleBoltClick = (boltId: number) => {
    if (!isPlaying) setIsPlaying(true);
    if (isComplete || gameOver) return;

    const bolt = bolts.find((n) => n.id === boltId);
    if (!bolt || bolt.sorted) return;

    if (bolt.type === currentTarget) {
      const newBolts = bolts.map((n) =>
        n.id === boltId ? { ...n, sorted: true } : n
      );
      setBolts(newBolts);

      const remainingOfType = newBolts.filter(
        (n) => n.type === currentTarget && !n.sorted
      ).length;

      if (remainingOfType === 0) {
        const currentIndex = boltTypes.indexOf(currentTarget);
        if (currentIndex < boltTypes.length - 1) {
          setCurrentTarget(boltTypes[currentIndex + 1]);
        } else {
          setIsComplete(true);
          setIsPlaying(false);
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bussipukkiBg})`,
      }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 bg-background/80 backdrop-blur-sm"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Takaisin
        </Button>

        <Card className="bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-4xl font-playful">Ruuvilajittelu</CardTitle>
            <CardDescription>
              Klikkaa ruuvit oikeassa järjestyksessä ennen kuin aika loppuu! Ole nopea!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className={`text-3xl font-bold flex items-center gap-2 ${
                timeLeft <= 10 ? "text-destructive animate-pulse" : "text-primary"
              }`} data-testid="text-timer">
                <Clock className="w-8 h-8" />
                {formatTime(timeLeft)}
              </div>
              <Button
                onClick={initializeGame}
                variant="outline"
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Aloita Alusta
              </Button>
            </div>

            {timeLeft <= 10 && timeLeft > 0 && isPlaying && (
              <div className="mb-4 p-3 bg-destructive/20 border-2 border-destructive rounded-lg">
                <p className="text-lg font-bold text-destructive text-center animate-pulse flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6" />
                  AIKA LOPPUU! VAIN {timeLeft} SEKUNTIA JÄLJELLÄ!
                  <Clock className="w-6 h-6" />
                </p>
              </div>
            )}

            {!isComplete && !gameOver && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-lg font-semibold text-center flex items-center justify-center gap-2">
                  <Bolt className={`w-6 h-6 ${boltColors[currentTarget]}`} />
                  Etsi ja klikkaa: {boltNames[currentTarget]}
                </p>
              </div>
            )}

            {gameOver && !isComplete && (
              <div className="mb-6 p-6 bg-destructive/10 rounded-lg border-2 border-destructive">
                <h3 className="text-2xl font-playful font-bold text-destructive mb-2 text-center">
                  Aika loppui!
                </h3>
                <p className="text-lg text-center mb-4">
                  Yritä uudelleen ja ole nopeampi seuraavalla kerralla!
                </p>
                <Button
                  onClick={initializeGame}
                  className="w-full"
                  data-testid="button-try-again"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Yritä Uudelleen
                </Button>
              </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {bolts.map((bolt) => (
                <button
                  key={bolt.id}
                  onClick={() => handleBoltClick(bolt.id)}
                  data-testid={`bolt-${bolt.id}`}
                  disabled={bolt.sorted || gameOver}
                  className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${
                    bolt.sorted
                      ? "bg-muted border-muted-border opacity-30 cursor-not-allowed"
                      : gameOver
                      ? "bg-card border-card-border opacity-50 cursor-not-allowed"
                      : "bg-card border-card-border hover-elevate active-elevate-2 cursor-pointer"
                  }`}
                >
                  <Bolt className={`w-12 h-12 ${boltColors[bolt.type]}`} />
                </button>
              ))}
            </div>

            {isComplete && (
              <div className="mt-6 p-6 bg-primary/10 rounded-lg border-2 border-primary">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-playful font-bold text-primary mb-2 text-center">
                  Loistavaa!
                </h3>
                <p className="text-lg text-center mb-6" data-testid="text-completion-time">
                  Lajittelit kaikki ruuvit {GAME_TIME - timeLeft} sekunnissa! Aikaa jäi {timeLeft} sekuntia!
                </p>

                {!scoreSaved && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="playerName">Tallenna aikasi - syötä nimesi:</Label>
                      <Input
                        id="playerName"
                        type="text"
                        placeholder="Nimesi"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        data-testid="input-player-name"
                      />
                    </div>
                    <Button
                      onClick={handleSaveScore}
                      className="w-full"
                      disabled={saveScoreMutation.isPending}
                      data-testid="button-save-score"
                    >
                      {saveScoreMutation.isPending ? "Tallennetaan..." : "Tallenna Pisteet"}
                    </Button>
                  </div>
                )}

                {scoreSaved && (
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground" data-testid="text-score-saved">
                      Pisteet tallennettu!
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-center text-muted-foreground mb-3">
                        Jaa tuloksesi:
                      </p>
                      <ShareButtons
                        gameType="nut-sort"
                        playerName={playerName}
                        score={GAME_TIME - timeLeft}
                        unit="sekuntia"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
