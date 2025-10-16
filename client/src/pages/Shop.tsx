import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Info } from "lucide-react";
import mugImage from "@assets/generated_images/Bussipukki_branded_mug_product_f62abf54.png";
import tshirtImage from "@assets/generated_images/Bussipukki_branded_t-shirt_product_6b0d628b.png";
import hoodieImage from "@assets/generated_images/Bussipukki_branded_hoodie_product_0b403f24.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Bussipukki Muki",
    price: 14.99,
    image: mugImage,
    category: "Juomatarvikkeet",
    description: "Keraaminen muki jouluisella Bussipukki-logolla. Täydellinen aamukaakaviin!",
  },
  {
    id: "2",
    name: "Bussipukki T-paita",
    price: 24.99,
    image: tshirtImage,
    category: "Vaatteet",
    description: "Punainen t-paita Bussipukki-painatuksella. 100% puuvillaa.",
  },
  {
    id: "3",
    name: "Bussipukki Huppari",
    price: 39.99,
    image: hoodieImage,
    category: "Vaatteet",
    description: "Lämmin vihreä huppari brodeeratulla logolla. Täydellinen talveen!",
  },
  {
    id: "4",
    name: "Bussipukki Muki - Kultainen",
    price: 16.99,
    image: mugImage,
    category: "Juomatarvikkeet",
    description: "Premium-muki kultaisilla yksityiskohdilla. Rajoitettu erä!",
  },
  {
    id: "5",
    name: "Bussipukki T-paita - Vihreä",
    price: 24.99,
    image: tshirtImage,
    category: "Vaatteet",
    description: "Vihreä t-paita jouluisella teemalla. Mukava ja tyylikäs.",
  },
  {
    id: "6",
    name: "Bussipukki Huppari - Punainen",
    price: 39.99,
    image: hoodieImage,
    category: "Vaatteet",
    description: "Punainen huppari joulupukin värein. Lämmittää kylmillä keleillä!",
  },
];

export default function Shop() {
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

          <div className="max-w-2xl mx-auto p-4 bg-[hsl(45,95%,55%)]/10 border-2 border-[hsl(45,95%,55%)] rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-[hsl(45,95%,55%)] flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-foreground mb-1">
                  Esimerkkituotteet
                </p>
                <p className="text-sm text-muted-foreground">
                  Nämä ovat esimerkkituotteita. Printful-integraatio lisätään myöhemmin,
                  kun API-avain on käytettävissä.
                </p>
              </div>
            </div>
          </div>
        </div>

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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge
                  className="absolute top-3 right-3 bg-[hsl(45,95%,55%)] text-[hsl(0,0%,15%)] border-0"
                  data-testid={`badge-example-${product.id}`}
                >
                  Esimerkki
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="font-playful text-xl">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {product.category}
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-primary whitespace-nowrap">
                    {product.price.toFixed(2)}€
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled
                  data-testid={`button-add-to-cart-${product.id}`}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Lisää Koriin (Tulossa)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
