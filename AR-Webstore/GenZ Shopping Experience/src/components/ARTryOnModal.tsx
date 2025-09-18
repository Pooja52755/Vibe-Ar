import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Camera, Eye, Scan, Sparkles, ShoppingBag, Star, Play, RotateCcw } from "lucide-react";
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
  arSupported: boolean;
  category: string;
}

interface ARTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ARTryOnModal({ isOpen, onClose, onAddToCart, onProductClick }: ARTryOnModalProps) {
  const [activeTab, setActiveTab] = useState("clothing");
  const [isARActive, setIsARActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const arProducts: Product[] = [
    {
      id: "ar1",
      name: "Classic White Shirt - AR Ready",
      brand: "AR Fashion",
      price: 1299,
      originalPrice: 1899,
      rating: 4.5,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBzaGlydHMlMjBjYXN1YWx8ZW58MXx8fHwxNzU4MDE2MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arSupported: true,
      category: "clothing"
    },
    {
      id: "ar2",
      name: "Floral Summer Dress - AR Enabled",
      brand: "Virtual Wardrobe",
      price: 2499,
      originalPrice: 3299,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1700158777421-2fd9263cec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTc5NDM2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arSupported: true,
      category: "clothing"
    },
    {
      id: "ar3",
      name: "Denim Jacket - AR Experience",
      brand: "Virtual Fits",
      price: 1999,
      originalPrice: 2999,
      rating: 4.3,
      reviews: 456,
      image: "https://images.unsplash.com/photo-1609681780826-e484497a971d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTc5MzA1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arSupported: true,
      category: "clothing"
    },
    {
      id: "ar4",
      name: "Platform Sneakers - AR Fit",
      brand: "AR Footwear",
      price: 3499,
      originalPrice: 4999,
      rating: 4.6,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1678802910315-b1bf6ca9f6a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9lcyUyMHNuZWFrZXJzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTgwMTYyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      arSupported: true,
      category: "footwear"
    }
  ];

  const filteredProducts = arProducts.filter(product => product.category === activeTab);

  const handleTryAR = (product: Product) => {
    setSelectedProduct(product);
    setIsARActive(true);
  };

  const handleStopAR = () => {
    setIsARActive(false);
    setSelectedProduct(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-black">
        {!isARActive ? (
          <>
            <DialogHeader className="p-6 pb-4 bg-white">
              <DialogTitle className="flex items-center space-x-2 text-2xl">
                <Eye className="h-6 w-6 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AR Try-On Studio
                </span>
              </DialogTitle>
              <p className="text-gray-600 mt-2">Experience fashion in augmented reality</p>
            </DialogHeader>

            <div className="bg-white">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="clothing" className="flex items-center space-x-2">
                    <Scan className="h-4 w-4" />
                    <span>Clothing</span>
                  </TabsTrigger>
                  <TabsTrigger value="footwear" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Footwear</span>
                  </TabsTrigger>
                  <TabsTrigger value="accessories" className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Accessories</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 pb-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border border-purple-100">
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* AR Badge */}
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            AR Ready
                          </Badge>

                          {/* AR Try-On Button Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              size="lg"
                              className="bg-white text-black hover:bg-gray-100"
                              onClick={() => handleTryAR(product)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Try AR
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
                            <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-300 text-purple-600 hover:bg-purple-50"
                              onClick={() => handleTryAR(product)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Try AR
                            </Button>
                            <Button
                              size="sm"
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                              onClick={() => onAddToCart(product)}
                            >
                              <ShoppingBag className="h-4 w-4 mr-1" />
                              Add to Bag
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* AR Instructions */}
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <Camera className="h-4 w-4 text-purple-600" />
                    <span>How AR Try-On Works</span>
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Point your camera at yourself for clothing try-on</p>
                    <p>• Place your foot on screen marker for shoe fitting</p>
                    <p>• Use gestures to change colors and sizes</p>
                    <p>• Take screenshots to share with friends</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* AR Camera View */
          <div className="relative w-full h-[90vh] bg-black flex items-center justify-center">
            {/* Simulated Camera View */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                  <Camera className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-medium">AR Camera Active</h2>
                <p className="text-gray-300">Position yourself in the camera view</p>
                
                {selectedProduct && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs mx-auto">
                    <p className="text-sm text-gray-300">Trying on:</p>
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-400">{selectedProduct.brand}</p>
                  </div>
                )}
              </div>

              {/* AR Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={handleStopAR}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  className="rounded-full bg-white text-black hover:bg-gray-100 px-8"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </Button>
                
                {selectedProduct && (
                  <Button
                    size="icon"
                    className="rounded-full bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => onAddToCart(selectedProduct)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* AR Overlay Info */}
              <div className="absolute top-6 left-6 right-6">
                <div className="flex justify-between items-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white">
                    <p className="text-xs text-gray-300">AR Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                  
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={handleStopAR}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}