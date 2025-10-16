import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export default function Shop() {
  const { data: products, isLoading, error } = useQuery<PrintfulProduct[]>({
    queryKey: ["/api/printful/store-products"],
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-playful font-bold text-foreground">
              Bussipukki Kauppa
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Tutustu Bussipukki-tuotteisiin ja ota joulu mukaan arkeen!
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Ladataan tuotteita...</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive mb-1">
                      Virhe tuotteiden lataamisessa
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tuotteiden hakeminen Printful-palvelusta epäonnistui. Yritä myöhemmin uudelleen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && !error && products && products.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-playful font-bold text-foreground mb-2">
              Ei tuotteita saatavilla
            </h2>
            <p className="text-muted-foreground">
              Lisää tuotteita Printful-kauppaan aloittaaksesi myynnin.
            </p>
          </div>
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="hover-elevate transition-transform overflow-hidden"
                data-testid={`product-card-${product.id}`}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden bg-white">
                    <img
                      src={product.thumbnail_url || 'https://via.placeholder.com/400x400?text=Ei+kuvaa'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-testid={`product-image-${product.id}`}
                    />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="font-playful text-xl" data-testid={`product-name-${product.id}`}>
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {product.variants} {product.variants === 1 ? 'variantti' : 'varianttia'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Korkealaatuinen Bussipukki-tuote jouluiseen teemaan. Tutustu tuotteeseen ja tilaa omasi!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    data-testid={`button-view-product-${product.id}`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Näytä Tuote
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
