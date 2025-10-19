import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface BoltSortGameProps {
  onBack: () => void;
}

type NutColor = "red" | "green" | "blue" | "gold" | "purple" | "orange";

interface Nut {
  id: string;
  color: NutColor;
}

interface Bolt {
  id: number;
  nuts: Nut[];
  maxNuts: number;
}

const NUT_COLORS: NutColor[] = ["red", "green", "blue", "gold", "purple", "orange"];
const COLOR_CLASSES = {
  red: "bg-primary border-primary",
  green: "bg-green-600 border-green-700",
  blue: "bg-blue-500 border-blue-600",
  gold: "bg-yellow-500 border-yellow-600",
  purple: "bg-purple-500 border-purple-600",
  orange: "bg-orange-500 border-orange-600",
};

const TOTAL_BOLTS = 30;
const NUTS_PER_COLOR = 4;
const MAX_NUTS_PER_BOLT = 5;
const GAME_TIME = 180; // 3 minutes

export function BoltSortGame({ onBack }: BoltSortGameProps) {
  const [bolts, setBolts] = useState<Bolt[]>([]);
  const [draggedNut, setDraggedNut] = useState<{ nut: Nut; fromBoltId: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isComplete && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            toast({
              title: "Aika loppui!",
              description: "Yritä uudelleen!",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete, timeLeft, toast]);

  const initializeGame = () => {
    const newBolts: Bolt[] = Array.from({ length: TOTAL_BOLTS }, (_, i) => ({
      id: i,
      nuts: [],
      maxNuts: MAX_NUTS_PER_BOLT,
    }));

    // Create nuts
    const allNuts: Nut[] = [];
    NUT_COLORS.forEach((color) => {
      for (let i = 0; i < NUTS_PER_COLOR; i++) {
        allNuts.push({
          id: `${color}-${i}`,
          color,
        });
      }
    });

    // Shuffle nuts
    for (let i = allNuts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNuts[i], allNuts[j]] = [allNuts[j], allNuts[i]];
    }

    // Distribute nuts randomly across bolts
    let nutIndex = 0;
    for (let i = 0; i < newBolts.length && nutIndex < allNuts.length; i++) {
      const nutsToAdd = Math.min(
        Math.floor(Math.random() * 3) + 1,
        MAX_NUTS_PER_BOLT,
        allNuts.length - nutIndex
      );
      
      for (let j = 0; j < nutsToAdd && nutIndex < allNuts.length; j++) {
        newBolts[i].nuts.push(allNuts[nutIndex]);
        nutIndex++;
      }
    }

    setBolts(newBolts);
    setMoves(0);
    setTimeLeft(GAME_TIME);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const checkWinCondition = (currentBolts: Bolt[]) => {
    // Track which bolt ID holds each color (to ensure no color is split)
    const colorBoltMap = new Map<NutColor, number>();
    
    for (const bolt of currentBolts) {
      if (bolt.nuts.length === 0) continue;
      
      // All nuts on this bolt must be the same color
      const firstColor = bolt.nuts[0].color;
      const allSameColor = bolt.nuts.every(nut => nut.color === firstColor);
      
      if (!allSameColor) return false;
      
      // Check if this color has been seen on a DIFFERENT bolt
      const existingBoltId = colorBoltMap.get(firstColor);
      if (existingBoltId !== undefined && existingBoltId !== bolt.id) {
        return false; // This color is split across multiple bolts!
      }
      
      // Track that this color is on this bolt
      colorBoltMap.set(firstColor, bolt.id);
      
      // Also verify this bolt has exactly NUTS_PER_COLOR (4)
      if (bolt.nuts.length !== NUTS_PER_COLOR) {
        return false; // Incomplete grouping
      }
    }
    
    return true;
  };

  const handleDragStart = (nut: Nut, boltId: number) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    
    // Can only drag the top nut
    const bolt = bolts.find(b => b.id === boltId);
    if (!bolt || bolt.nuts[bolt.nuts.length - 1].id !== nut.id) {
      return;
    }
    
    setDraggedNut({ nut, fromBoltId: boltId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toBoltId: number) => {
    if (!draggedNut) return;

    const { nut, fromBoltId } = draggedNut;
    
    // Can't drop on same bolt
    if (fromBoltId === toBoltId) {
      setDraggedNut(null);
      return;
    }

    const fromBolt = bolts.find(b => b.id === fromBoltId);
    const toBolt = bolts.find(b => b.id === toBoltId);

    if (!fromBolt || !toBolt) {
      setDraggedNut(null);
      return;
    }

    // Check if target bolt has space
    if (toBolt.nuts.length >= toBolt.maxNuts) {
      toast({
        title: "Ruuvi täynnä!",
        description: "Tämä ruuvi on jo täynnä muttereita.",
        variant: "destructive",
      });
      setDraggedNut(null);
      return;
    }

    // Move nut
    const updatedBolts = bolts.map(bolt => {
      if (bolt.id === fromBoltId) {
        return { ...bolt, nuts: bolt.nuts.slice(0, -1) };
      }
      if (bolt.id === toBoltId) {
        return { ...bolt, nuts: [...bolt.nuts, nut] };
      }
      return bolt;
    });

    setBolts(updatedBolts);
    setMoves(prev => prev + 1);
    setDraggedNut(null);

    // Check win condition
    if (checkWinCondition(updatedBolts)) {
      setIsComplete(true);
      setIsPlaying(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "🎉 Voitit!",
        description: `Sait pelin valmiiksi ${moves + 1} siirrolla ajassa ${formatTime(GAME_TIME - timeLeft)}!`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-playful font-bold text-foreground">
            Ruuvilajittelu
          </h1>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className={`text-xl font-semibold ${timeLeft < 30 ? 'text-red-600' : ''}`} data-testid="text-timer">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold" data-testid="text-moves">{moves} siirtoa</span>
            </div>
          </div>
          <Button onClick={initializeGame} data-testid="button-reset">
            <RotateCcw className="w-4 h-4 mr-2" />
            Aloita Alusta
          </Button>
        </div>

        {/* Instructions */}
        <p className="text-center mb-6 text-lg">
          Järjestä kaikki saman väriset mutterit samalle ruuville! Raahaa muttereita ruuvista toiseen.
        </p>

        {/* Game Board */}
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {bolts.map((bolt) => (
            <div
              key={bolt.id}
              className="flex flex-col items-center"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(bolt.id)}
              data-testid={`bolt-${bolt.id}`}
            >
              {/* Bolt (pystyruuvi) */}
              <div className="relative w-full aspect-[1/3] bg-gradient-to-b from-slate-400 to-slate-500 rounded-sm shadow-md border-2 border-slate-600 flex flex-col-reverse items-center p-1 gap-1">
                {/* Nuts on bolt */}
                {bolt.nuts.map((nut, index) => (
                  <div
                    key={nut.id}
                    draggable={index === bolt.nuts.length - 1}
                    onDragStart={() => handleDragStart(nut, bolt.id)}
                    className={`w-full aspect-square rounded-full border-4 ${COLOR_CLASSES[nut.color]} 
                      shadow-lg cursor-grab active:cursor-grabbing hover:scale-105 transition-transform
                      ${index === bolt.nuts.length - 1 ? 'hover:brightness-110' : 'cursor-not-allowed opacity-90'}`}
                    data-testid={`nut-${nut.id}`}
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
