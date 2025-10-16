import { Button } from "@/components/ui/button";
import { SiX, SiFacebook } from "react-icons/si";
import { Share2 } from "lucide-react";

interface ShareButtonsProps {
  gameType: string;
  playerName: string;
  score: number;
  unit?: string;
}

export function ShareButtons({ gameType, playerName, score, unit = "sekuntia" }: ShareButtonsProps) {
  const gameNames: Record<string, string> = {
    puzzle: "Joulupalapeli",
    "nut-sort": "Pähkinälajittelu",
    memory: "Muistipeli",
    quiz: "Bussikilpailu",
  };

  const gameName = gameNames[gameType] || gameType;
  const shareText = `Pelasin Bussipukin ${gameName} -peliä ja sain tuloksen ${score} ${unit}!`;
  const shareUrl = window.location.origin;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, "_blank", "width=550,height=420");
  };

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: `Bussipukki - ${gameName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && 'share' in navigator;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        onClick={handleTwitterShare}
        variant="outline"
        className="gap-2"
        data-testid="button-share-twitter"
      >
        <SiX className="w-4 h-4" />
        Jaa X:ssä
      </Button>
      <Button
        onClick={handleFacebookShare}
        variant="outline"
        className="gap-2"
        data-testid="button-share-facebook"
      >
        <SiFacebook className="w-4 h-4" />
        Jaa Facebookissa
      </Button>
      {hasNativeShare && (
        <Button
          onClick={handleNativeShare}
          variant="outline"
          className="gap-2"
          data-testid="button-share-native"
        >
          <Share2 className="w-4 h-4" />
          Jaa
        </Button>
      )}
    </div>
  );
}
