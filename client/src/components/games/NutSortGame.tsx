import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, RotateCcw, Nut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface NutSortGameProps {
  onBack: () => void;
}

interface NutItem {
  id: number;
  type: "walnut" | "almond" | "hazelnut" | "cashew";
  sorted: boolean;
}

const nutTypes = ["walnut", "almond", "hazelnut", "cashew"] as const;
const nutColors = {
  walnut: "text-amber-700",
  almond: "text-amber-600",
  hazelnut: "text-amber-800",
  cashew: "text-yellow-700",
};
const nutNames = {
  walnut: "Saksanpähkinä",
  almond: "Manteli",
  hazelnut: "Hasselpähkinä",
  cashew: "Cashewpähkinä",
};

export function NutSortGame({ onBack }: NutSortGameProps) {
  const [nuts, setNuts] = useState<NutItem[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<typeof nutTypes[number]>("walnut");
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
        description: `${playerName}, aikasi ${formatTime(timer)} on nyt tallennettu.`,
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
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  const initializeGame = () => {
    const newNuts: NutItem[] = [];
    const nutsPerType = 3;
    
    nutTypes.forEach((type) => {
      for (let i = 0; i < nutsPerType; i++) {
        newNuts.push({
          id: newNuts.length,
          type,
          sorted: false,
        });
      }
    });

    for (let i = newNuts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newNuts[i], newNuts[j]] = [newNuts[j], newNuts[i]];
    }

    setNuts(newNuts);
    setTimer(0);
    setIsPlaying(false);
    setIsComplete(false);
    setCurrentTarget("walnut");
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
    saveScoreMutation.mutate({
      playerName,
      timeSeconds: timer,
      gameType: "nut-sort",
    });
  };

  const handleNutClick = (nutId: number) => {
    if (!isPlaying) setIsPlaying(true);
    if (isComplete) return;

    const nut = nuts.find((n) => n.id === nutId);
    if (!nut || nut.sorted) return;

    if (nut.type === currentTarget) {
      const newNuts = nuts.map((n) =>
        n.id === nutId ? { ...n, sorted: true } : n
      );
      setNuts(newNuts);

      const remainingOfType = newNuts.filter(
        (n) => n.type === currentTarget && !n.sorted
      ).length;

      if (remainingOfType === 0) {
        const currentIndex = nutTypes.indexOf(currentTarget);
        if (currentIndex < nutTypes.length - 1) {
          setCurrentTarget(nutTypes[currentIndex + 1]);
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Takaisin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-playful">Pähkinälajittelu</CardTitle>
            <CardDescription>
              Klikkaa pähkinät oikeassa järjestyksessä! Seuraa ohjeita ja lajittele kaikki.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="text-2xl font-bold text-primary" data-testid="text-timer">
                {formatTime(timer)}
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

            {!isComplete && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <p className="text-lg font-semibold text-center flex items-center justify-center gap-2">
                  <Nut className={`w-6 h-6 ${nutColors[currentTarget]}`} />
                  Etsi ja klikkaa: {nutNames[currentTarget]}
                </p>
              </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {nuts.map((nut) => (
                <button
                  key={nut.id}
                  onClick={() => handleNutClick(nut.id)}
                  data-testid={`nut-${nut.id}`}
                  disabled={nut.sorted}
                  className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${
                    nut.sorted
                      ? "bg-muted border-muted-border opacity-30 cursor-not-allowed"
                      : "bg-card border-card-border hover-elevate active-elevate-2 cursor-pointer"
                  }`}
                >
                  <Nut className={`w-12 h-12 ${nutColors[nut.type]}`} />
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
                  Lajittelit kaikki pähkinät ajassa {formatTime(timer)}!
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
                  <p className="text-center text-muted-foreground" data-testid="text-score-saved">
                    Pisteet tallennettu!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
