import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trophy, Clock } from "lucide-react";
import {
  Gift,
  Snowflake,
  Star,
  TreePine,
  Candy,
  Bell,
  Heart,
  Sparkles,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CARD_ICONS = [
  { icon: Gift, color: "text-primary" },
  { icon: Snowflake, color: "text-blue-400" },
  { icon: Star, color: "text-yellow-400" },
  { icon: TreePine, color: "text-green-600" },
  { icon: Candy, color: "text-pink-400" },
  { icon: Bell, color: "text-gold-400" },
  { icon: Heart, color: "text-red-400" },
  { icon: Sparkles, color: "text-purple-400" },
];

interface MemoryCard {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
}

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const { toast } = useToast();

  const saveScoreMutation = useMutation({
    mutationFn: async (data: { playerName: string; timeSeconds: number }) => {
      return apiRequest("/api/puzzle-scores", "POST", {
        ...data,
        gameType: "memory",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzle-scores", "memory"] });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast({
        title: "Tuloksesi tallennettu!",
        description: "Loistavaa peliä! Tuloksesi on nyt tulostaulussa.",
      });
      setShowSaveDialog(false);
    },
  });

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.iconIndex === secondCard.iconIndex) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves((m) => m + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsActive(false);
      setGameComplete(true);
      setShowSaveDialog(true);
    }
  }, [cards]);

  const initializeGame = () => {
    const shuffledIcons = [...CARD_ICONS, ...CARD_ICONS]
      .map((icon, index) => ({
        id: index,
        iconIndex: index % CARD_ICONS.length,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledIcons);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsActive(false);
    setGameComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (!isActive) setIsActive(true);

    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  const handleSaveScore = () => {
    if (!playerName.trim()) {
      toast({
        title: "Virhe",
        description: "Syötä nimesi tallentaaksesi tuloksen",
        variant: "destructive",
      });
      return;
    }
    saveScoreMutation.mutate({ playerName: playerName.trim(), timeSeconds: time });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-playful font-bold text-foreground">
            Muistipeli
          </h1>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">{formatTime(time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">{moves} siirtoa</span>
            </div>
          </div>
          <Button onClick={initializeGame} data-testid="button-restart">
            Aloita Uudelleen
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const IconComponent = CARD_ICONS[card.iconIndex].icon;
            const iconColor = CARD_ICONS[card.iconIndex].color;

            return (
              <div
                key={card.id}
                className="aspect-square perspective-1000"
                onClick={() => handleCardClick(card.id)}
                data-testid={`card-${card.id}`}
              >
                <div
                  className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d ${
                    card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                  } ${card.isMatched ? "opacity-50" : ""}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="absolute w-full h-full backface-hidden hover-elevate">
                    <CardContent className="flex items-center justify-center h-full p-0">
                      <div className="w-full h-full bg-primary/20 rounded-md flex items-center justify-center">
                        <span className="text-4xl font-festive text-primary">?</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="absolute w-full h-full backface-hidden rotate-y-180"
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                  >
                    <CardContent className="flex items-center justify-center h-full p-0">
                      <IconComponent className={`w-12 h-12 ${iconColor}`} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-playful text-2xl">
              Loistavaa! Peli läpi!
            </DialogTitle>
            <DialogDescription>
              Sait pelin valmiiksi {moves} siirrolla ajassa {formatTime(time)}!
              Haluatko tallentaa tuloksesi?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="player-name">Nimesi</Label>
            <Input
              id="player-name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Syötä nimesi"
              data-testid="input-player-name-memory"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              data-testid="button-skip-save"
            >
              Ohita
            </Button>
            <Button
              onClick={handleSaveScore}
              disabled={saveScoreMutation.isPending}
              data-testid="button-save-score-memory"
            >
              {saveScoreMutation.isPending ? "Tallennetaan..." : "Tallenna"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
