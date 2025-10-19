import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle } from "lucide-react";
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
import { ShareButtons } from "@/components/ShareButtons";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Mikä linja kulkee Porin keskustasta Meri-Poriin?",
    options: ["Linja 1", "Linja 7", "Linja 43", "Linja 32"],
    correctAnswer: 2,
  },
  {
    question: "Montako laituria Porin kauppatorilla on?",
    options: ["4", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    question: "Mikä on Porin keskustan pääpysäkki?",
    options: ["Torikeskus", "Puuvilla", "Kauppatori", "Yrjönkatu"],
    correctAnswer: 2,
  },
  {
    question: "Milloin Porin Linjat oy aloitti toimintansa?",
    options: ["1965", "1972", "1976", "1983"],
    correctAnswer: 2,
  },
  {
    question: "Mikä linja kulkee Sampolaan?",
    options: ["Linja 2", "Linja 4", "Linja 6", "Linja 8"],
    correctAnswer: 2,
  },
  {
    question: "Kuinka pitkä on Porin pisin bussilinja?",
    options: ["25 km", "32 km", "41 km", "55 km"],
    correctAnswer: 2,
  },
  {
    question: "Missä linjan 60 päätepysäkki on?",
    options: ["Reposaaren rannassa", "Ulvilan Naparannassa", "Kirjurinluodon rannassa", "Lyttylän merenrannassa"],
    correctAnswer: 3,
  },
  {
    question: "Millä linjalla pääsee Porin-Satakunnan lentoasemalle?",
    options: ["Linja 9", "Linja 11", "Tilausbussi", "Ei pääse bussilla"],
    correctAnswer: 2,
  },
  {
    question: "Montako bussia Porin linjoilla on?",
    options: ["30-40", "40-50", "50-60", "60-70"],
    correctAnswer: 3,
  },
  {
    question: "Minkä verran pysäkkejä on Porin Linjojen lyhimmällä linjalla?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
  },
];

interface QuizGameProps {
  onBack: () => void;
}

export function QuizGame({ onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const { toast } = useToast();

  const saveScoreMutation = useMutation({
    mutationFn: async (data: { playerName: string; timeSeconds: number }) => {
      console.log("🔵 Saving score:", data);
      const result = await apiRequest("/api/puzzle-scores", "POST", {
        ...data,
        gameType: "quiz",
      });
      console.log("✅ Score saved:", result);
      return result;
    },
    onSuccess: () => {
      console.log("🎉 onSuccess called!");
      queryClient.invalidateQueries({ queryKey: ["/api/puzzle-scores", "quiz"] });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast({
        title: "Tuloksesi tallennettu!",
        description: "Loistavaa peliä! Tuloksesi on nyt tulostaulussa.",
      });
      setScoreSaved(true);
      setShowSaveDialog(false);
    },
    onError: (error) => {
      console.error("❌ onError called:", error);
      toast({
        title: "Virhe",
        description: "Tallennus epäonnistui: " + (error instanceof Error ? error.message : "Tuntematon virhe"),
        variant: "destructive",
      });
    },
  });

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

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const isCorrect = index === QUIZ_QUESTIONS[currentQuestion].correctAnswer;

    if (isCorrect) {
      setCorrectAnswers((c) => c + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(null);
      } else {
        setIsActive(false);
        setShowResult(true);
        setShowSaveDialog(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setShowResult(false);
    setTime(0);
    setIsActive(true);
    setScoreSaved(false);
    setPlayerName("");
    setShowSaveDialog(false);
  };

  const handleSaveScore = () => {
    console.log("🔘 handleSaveScore called, playerName:", playerName, "time:", time);
    if (!playerName.trim()) {
      toast({
        title: "Virhe",
        description: "Syötä nimesi tallentaaksesi tuloksen",
        variant: "destructive",
      });
      return;
    }
    console.log("🚀 Calling mutation...");
    saveScoreMutation.mutate({ playerName: playerName.trim(), timeSeconds: time });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestionData = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
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
            Bussitietovisa
          </h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">{formatTime(time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">
                {correctAnswers}/{QUIZ_QUESTIONS.length}
              </span>
            </div>
          </div>
          <Button onClick={resetQuiz} data-testid="button-restart">
            Aloita Uudelleen
          </Button>
        </div>

        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Kysymys {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
          </p>
        </div>

        {!showResult ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-playful text-2xl">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestionData.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestionData.correctAnswer;
                const showCorrect = selectedAnswer !== null && isCorrect;
                const showWrong = selectedAnswer !== null && isSelected && !isCorrect;

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-4 ${
                      showCorrect ? "bg-green-500/20 border-green-500" : ""
                    } ${showWrong ? "bg-destructive/20 border-destructive" : ""}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    data-testid={`quiz-option-${index}`}
                  >
                    <span className="flex items-center gap-3 w-full">
                      <span className="flex-1">{option}</span>
                      {showCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {showWrong && <XCircle className="w-5 h-5 text-destructive" />}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-playful text-3xl text-center">
                Visa Suoritettu!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {correctAnswers}/{QUIZ_QUESTIONS.length}
              </div>
              <p className="text-xl text-muted-foreground">
                Sait {correctAnswers} oikein {QUIZ_QUESTIONS.length} kysymyksestä!
              </p>
              <p className="text-lg">
                Aika: <span className="font-semibold">{formatTime(time)}</span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-playful text-2xl">
              Loistavaa! Visa suoritettu!
            </DialogTitle>
            <DialogDescription>
              Sait {correctAnswers}/{QUIZ_QUESTIONS.length} oikein ajassa {formatTime(time)}!
              {!scoreSaved && " Haluatko tallentaa tuloksesi?"}
            </DialogDescription>
          </DialogHeader>
          {!scoreSaved ? (
            <>
              <div className="py-4">
                <Label htmlFor="player-name">Nimesi</Label>
                <Input
                  id="player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Syötä nimesi"
                  data-testid="input-player-name-quiz"
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
                  data-testid="button-save-score-quiz"
                >
                  {saveScoreMutation.isPending ? "Tallennetaan..." : "Tallenna"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-4 space-y-4">
                <p className="text-center text-muted-foreground">
                  Tuloksesi on tallennettu!
                </p>
                <div className="pt-2 border-t">
                  <p className="text-sm text-center text-muted-foreground mb-3">
                    Jaa tuloksesi:
                  </p>
                  <ShareButtons
                    gameType="quiz"
                    playerName={playerName}
                    score={time}
                    unit="sekuntia"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowSaveDialog(false)} data-testid="button-close-dialog-quiz">
                  Sulje
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
