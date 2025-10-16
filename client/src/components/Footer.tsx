import { Bus, Mail } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-[hsl(140,45%,35%)] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bus className="w-8 h-8 text-primary" />
              <span className="text-2xl font-festive font-bold">Bussipukki</span>
            </div>
            <p className="text-sm text-white/80">
              Tervetuloa Porin linjojen kuljettajan jouluisille sivuille!
              Pelaa pelejä, osallistu TikTok liveen ja tutustu kauppaan.
            </p>
          </div>

          <div>
            <h3 className="font-playful font-semibold text-lg mb-4">Pelit</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Joulupalapeli</li>
              <li>Pähkinälajittelu</li>
              <li>TikTok Arvaus</li>
            </ul>
          </div>

          <div>
            <h3 className="font-playful font-semibold text-lg mb-4">Seuraa</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover-elevate active-elevate-2 p-2 rounded-md"
                aria-label="TikTok"
                data-testid="link-tiktok"
              >
                <SiTiktok className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover-elevate active-elevate-2 p-2 rounded-md"
                aria-label="Email"
                data-testid="link-email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Bussipukki. Porin linjat.</p>
        </div>
      </div>
    </footer>
  );
}
