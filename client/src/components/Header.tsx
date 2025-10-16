import { Link, useLocation } from "wouter";
import { Bus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Etusivu" },
    { path: "/pelit", label: "Pelit" },
    { path: "/arvaus", label: "TikTok Arvaus" },
    { path: "/kauppa", label: "Kauppa" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[hsl(140,45%,35%)] border-b border-[hsl(140,40%,30%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" data-testid="link-home">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-transform">
              <Bus className="w-8 h-8 text-primary" />
              <span className="text-2xl font-festive text-white font-bold">
                Bussipukki
              </span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  data-testid={`link-nav-${item.label.toLowerCase()}`}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    location === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-white hover-elevate active-elevate-2"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[hsl(140,40%,30%)]">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    data-testid={`link-mobile-${item.label.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                      location === item.path
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover-elevate active-elevate-2"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
