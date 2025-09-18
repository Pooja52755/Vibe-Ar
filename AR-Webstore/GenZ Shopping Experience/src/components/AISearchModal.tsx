import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Wand2, Image, Mic, Camera, Send, Sparkles, TrendingUp } from "lucide-react";

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function AISearchModal({ isOpen, onClose, onSearch }: AISearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trendingSearches = [
    "Y2K aesthetic outfits",
    "Cozy work from home fits",
    "Date night casual vibes", 
    "Festival ready looks",
    "Minimalist capsule wardrobe",
    "Vintage denim collection",
    "Sustainable fashion pieces",
    "Street style essentials"
  ];

  const aiFeatures = [
    {
      icon: <Wand2 className="h-5 w-5" />,
      title: "Vibe Search",
      description: "Describe your mood or style",
      example: "Cozy Sunday morning vibes"
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: "Visual Search", 
      description: "Upload image to find similar",
      example: "Find similar but in pastels"
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Style Camera",
      description: "Take photo for instant match",
      example: "Snap and shop similar"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestions = [
        `${searchQuery} + trending colors`,
        `${searchQuery} + budget friendly`,
        `${searchQuery} + premium brands`,
        `${searchQuery} + eco-friendly options`
      ];
      setAiSuggestions(suggestions);
      setIsLoading(false);
      onSearch(searchQuery);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Style Assistant
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Describe your style, mood, or occasion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-20 py-4 text-lg border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Mic className="h-4 w-4 text-purple-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Camera className="h-4 w-4 text-purple-600" />
              </Button>
              <Button 
                size="icon" 
                className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>

          {/* AI Features */}
          <div className="grid md:grid-cols-3 gap-4">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      <p className="text-xs text-purple-600 mt-2 italic">"{feature.example}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>AI Suggestions</span>
              </h3>
              <div className="grid gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    onClick={() => onSearch(suggestion)}
                  >
                    <Wand2 className="h-4 w-4 mr-2 text-purple-600" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-pink-600" />
              <span>Trending Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors py-1 px-3"
                  onClick={() => {
                    setSearchQuery(search);
                    onSearch(search);
                  }}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>

          {/* Example Queries */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Try these AI-powered searches:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• "Outfits for a rainy day in Bengaluru"</p>
              <p>• "Find me something like this but in pastel colors" (+ upload image)</p>
              <p>• "Cottagecore aesthetic but make it urban"</p>
              <p>• "Sustainable fashion for office meetings"</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}