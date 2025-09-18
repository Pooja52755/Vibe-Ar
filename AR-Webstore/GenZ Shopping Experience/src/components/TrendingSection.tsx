import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  isNew?: boolean;
  aiMatch?: number;
}

interface TrendingSectionProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onWishlist: (product: Product) => void;
}

export function TrendingSection({ onAddToCart, onProductClick, onWishlist }: TrendingSectionProps) {
  const trendingProducts: Product[] = [
    {
      id: "1",
      name: "Oversized Denim Jacket - Vintage Wash",
      brand: "Urban Vibes",
      price: 1999,
      originalPrice: 2999,
      rating: 4.5,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1609681780826-e484497a971d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTc5MzA1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isNew: true,
      aiMatch: 94
    },
    {
      id: "2", 
      name: "Floral Midi Dress - Cottagecore Aesthetic",
      brand: "Boho Dreams",
      price: 2499,
      originalPrice: 3299,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1700158777421-2fd9263cec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTc5NDM2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      aiMatch: 89
    },
    {
      id: "3",
      name: "Classic White Button-Down Shirt", 
      brand: "Minimalist Co",
      price: 1299,
      originalPrice: 1899,
      rating: 4.3,
      reviews: 456,
      image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBzaGlydHMlMjBjYXN1YWx8ZW58MXx8fHwxNzU4MDE2MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      aiMatch: 87
    },
    {
      id: "4",
      name: "Chunky Platform Sneakers - Y2K Style",
      brand: "RetroFit",
      price: 3499,
      originalPrice: 4999,
      rating: 4.6,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1678802910315-b1bf6ca9f6a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9lcyUyMHNuZWFrZXJzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTgwMTYyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isNew: true,
      aiMatch: 92
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
            View All
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              onWishlist={onWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}