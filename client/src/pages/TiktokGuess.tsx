import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Sparkles } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import confetti from "canvas-confetti";

export default function TiktokGuess() {
  const [playerName, setPlayerName] = useState("");
  const [guessedNumber, setGuessedNumber] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitGuessMutation = useMutation({
    mutationFn: async (data: { playerName: string; guessedNumber: number }) => {
      return await apiRequest("POST", "/api/tiktok-guesses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tiktok-guesses"] });
      toast({
        title: "Arvaus lähetetty!",
        description: `${playerName}, arvauksesi ${guessedNumber} on nyt tallennettu.`,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setPlayerName("");
      setGuessedNumber("");
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Arvauksen lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: "Virhe",
        description: "Syötä nimesi tai käyttäjätunnuksesi",
        variant: "destructive",
      });
      return;
    }

    const number = parseInt(guessedNumber);
    if (isNaN(number) || number < 0) {
      toast({
        title: "Virhe",
        description: "Syötä kelvollinen numero",
        variant: "destructive",
      });
      return;
    }

    submitGuessMutation.mutate({ playerName, guessedNumber: number });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SiTiktok className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-playful font-bold text-foreground">
              TikTok Live Arvaus
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Arvaa montako vitsiä kerron tämän päivän livessä!
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-[hsl(45,95%,55%)]/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <CardTitle className="text-3xl font-playful">
                Live Arvaus Käynnissä
              </CardTitle>
            </div>
            <CardDescription className="text-base">
              Osallistu arvaukseen ennen liven alkua. Näen kaikki vastaukset liven lopussa!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="playerName" className="text-lg font-semibold">
                  Nimesi tai TikTok-käyttäjätunnuksesi
                </Label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="esim. @bussipukki"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="text-lg"
                  data-testid="input-player-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guessedNumber" className="text-lg font-semibold">
                  Montako vitsiä arvaat?
                </Label>
                <Input
                  id="guessedNumber"
                  type="number"
                  min="0"
                  placeholder="esim. 15"
                  value={guessedNumber}
                  onChange={(e) => setGuessedNumber(e.target.value)}
                  className="text-lg"
                  data-testid="input-guess-number"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg"
                disabled={submitGuessMutation.isPending}
                data-testid="button-submit-guess"
              >
                {submitGuessMutation.isPending ? (
                  "Lähetetään..."
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Lähetä Arvaus
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Miten peli toimii?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Arvaa montako vitsiä kerron tämän päivän TikTok livessä</li>
                    <li>• Lähetä arvauksesi ennen liven alkua</li>
                    <li>• Näen kaikki arvaukset liven lopussa</li>
                    <li>• Lähimpänä oikea arvaus voittaa!</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
