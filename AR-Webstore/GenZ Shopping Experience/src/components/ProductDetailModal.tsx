import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { Heart, Star, ShoppingBag, Sparkles, TrendingUp, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  aiMatch?: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, size?: string) => void;
  onWishlist: (product: Product) => void;
}

export function ProductDetailModal({ isOpen, onClose, product, onAddToCart, onWishlist }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  if (!product) return null;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const aiRecommendations = [
    "Perfect for casual brunches and weekend outings",
    "Pairs well with denim jackets and sneakers",
    "Trending among GenZ for its versatile style",
    "Sustainable fabric choice - eco-friendly option",
    "Influencers are styling this with high-waisted jeans"
  ];

  const similarProducts = [
    { name: "Similar Style", price: "₹1,299", image: product.image },
    { name: "In Different Color", price: "₹1,199", image: product.image },
    { name: "Same Brand", price: "₹1,499", image: product.image }
  ];

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative">
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-96 md:h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.aiMatch && (
                <Badge className="bg-purple-500 text-white flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>{product.aiMatch}% AI MATCH</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <Badge className="bg-green-100 text-green-700">
                    ₹{product.originalPrice - product.price} OFF
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* AI Recommendations */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                className="w-full justify-between border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <span className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Style Insights</span>
                </span>
                <TrendingUp className="h-4 w-4" />
              </Button>

              {showAIRecommendations && (
                <div className="space-y-2 p-3 bg-purple-50 rounded-lg">
                  {aiRecommendations.map((rec, index) => (
                    <p key={index} className="text-sm text-purple-700 flex items-start space-x-2">
                      <Sparkles className="h-3 w-3 mt-1 flex-shrink-0" />
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div className="space-y-2">
                <h3 className="font-medium">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? "bg-pink-600 hover:bg-pink-700" : ""}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div className="space-y-2">
                <h3 className="font-medium">Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Bag
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
                onClick={() => onWishlist(product)}
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Similar Products */}
            <div className="space-y-3">
              <h3 className="font-medium">You might also like</h3>
              <div className="grid grid-cols-3 gap-2">
                {similarProducts.map((similar, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-2">
                      <ImageWithFallback
                        src={similar.image}
                        alt={similar.name}
                        className="w-full h-16 object-cover rounded mb-1"
                      />
                      <p className="text-xs font-medium truncate">{similar.name}</p>
                      <p className="text-xs text-gray-600">{similar.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}