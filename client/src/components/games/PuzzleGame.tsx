import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface PuzzleGameProps {
  onBack: () => void;
}

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
}

export function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const { toast } = useToast();

  const gridSize = 3;
  const totalPieces = gridSize * gridSize;

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
    const initialPieces: PuzzlePiece[] = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      currentPosition: i,
      correctPosition: i,
    }));

    const shuffled = [...initialPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }

    setPieces(shuffled);
    setTimer(0);
    setIsPlaying(false);
    setIsComplete(false);
    setSelectedPiece(null);
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
      gameType: "puzzle",
    });
  };

  const handlePieceClick = (pieceIndex: number) => {
    if (!isPlaying) setIsPlaying(true);
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(pieceIndex);
    } else {
      const newPieces = [...pieces];
      const temp = newPieces[selectedPiece].currentPosition;
      newPieces[selectedPiece].currentPosition = newPieces[pieceIndex].currentPosition;
      newPieces[pieceIndex].currentPosition = temp;
      setPieces(newPieces);
      setSelectedPiece(null);

      const allCorrect = newPieces.every((p) => p.currentPosition === p.correctPosition);
      if (allCorrect) {
        setIsComplete(true);
        setIsPlaying(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

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
            <CardTitle className="text-4xl font-playful">Joulupalapeli</CardTitle>
            <CardDescription>
              Klikkaa kahta palasta vaihtaaksesi niiden paikkoja. Järjestä kuva oikein!
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

            <div
              className="grid gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: "400px",
              }}
            >
              {sortedPieces.map((piece, index) => {
                const row = Math.floor(piece.id / gridSize);
                const col = piece.id % gridSize;
                const isSelected = selectedPiece !== null && pieces[selectedPiece].currentPosition === piece.currentPosition;

                return (
                  <button
                    key={piece.id}
                    onClick={() => handlePieceClick(index)}
                    data-testid={`puzzle-piece-${piece.id}`}
                    className={`aspect-square border-4 rounded-md transition-all hover-elevate active-elevate-2 ${
                      isSelected
                        ? "border-primary scale-95"
                        : "border-card-border"
                    }`}
                    style={{
                      backgroundImage: `url(${import.meta.env.BASE_URL}assets/generated_images/Christmas_puzzle_game_preview_e1d3c0db.png)`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                    }}
                  />
                );
              })}
            </div>

            {isComplete && (
              <div className="mt-6 p-6 bg-primary/10 rounded-lg border-2 border-primary">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-playful font-bold text-primary mb-2 text-center">
                  Onnittelut!
                </h3>
                <p className="text-lg text-center mb-6" data-testid="text-completion-time">
                  Sait palapelin valmiiksi ajassa {formatTime(timer)}!
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
