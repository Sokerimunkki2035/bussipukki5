import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, ShoppingBag, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section
        className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-[hsl(0,84%,40%)] to-[hsl(140,45%,35%)]"
      >
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-festive font-bold text-white mb-6 drop-shadow-lg">
            Tervetuloa Bussipukin Sivuille!
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
            Porin linjojen kuljettajan jouluinen pelikärry täynnä hauskuutta
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pelit">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8 py-6"
                data-testid="button-play-games"
              >
                <Gamepad2 className="w-6 h-6 mr-2" />
                Pelaa Pelejä
              </Button>
            </Link>
            <Link href="/kauppa">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-2 border-[hsl(45,95%,55%)] text-white hover:bg-white/20"
                data-testid="button-shop"
              >
                <ShoppingBag className="w-6 h-6 mr-2" />
                Selaa Kauppaa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playful font-bold text-center mb-12 text-foreground">
            Mitä Bussipukilla on tarjolla?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate transition-transform">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-md overflow-hidden bg-gradient-to-br from-primary/20 to-red-600/20 flex items-center justify-center">
                  <Gamepad2 className="w-24 h-24 text-primary" />
                </div>
                <CardTitle className="font-playful text-2xl flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                  Jouluiset Pelit
                </CardTitle>
                <CardDescription>
                  Pelaa jouluista palapeliä tai lajittele pähkinöitä. Haasta
                  itsesi ja katso kuinka nopeasti pärjäät!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pelit">
                  <Button className="w-full" data-testid="button-card-games">
                    Pelaa Nyt
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-transform">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-md bg-gradient-to-br from-primary/20 to-[hsl(45,95%,55%)]/20 flex items-center justify-center">
                  <Trophy className="w-24 h-24 text-primary" />
                </div>
                <CardTitle className="font-playful text-2xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  TikTok Live Arvaus
                </CardTitle>
                <CardDescription>
                  Osallistu live-lähetyksiin ja arvaa montako vitsiä kerron!
                  Parhaat arvaukset palkitaan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/arvaus">
                  <Button className="w-full" data-testid="button-card-guess">
                    Arvaa Nyt
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-transform">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-md bg-gradient-to-br from-[hsl(140,45%,35%)]/20 to-[hsl(45,95%,55%)]/20 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-[hsl(140,45%,35%)]" />
                </div>
                <CardTitle className="font-playful text-2xl flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                  Bussipukki Kauppa
                </CardTitle>
                <CardDescription>
                  Tutustu Bussipukki-tuotteisiin! T-paitoja, huppareita ja
                  mukeja jouluisella teemalla.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/kauppa">
                  <Button className="w-full" data-testid="button-card-shop">
                    Selaa Tuotteita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
