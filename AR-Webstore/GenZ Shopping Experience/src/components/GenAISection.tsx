import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Wand2, Image, Mic, Camera, Sparkles } from "lucide-react";

export function GenAISection() {
  const aiFeatures = [
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "Vibe Search",
      description: "Find outfits by describing your mood or occasion",
      example: '"Cozy Sunday morning vibes"',
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "Visual Search",
      description: "Upload any image to find similar styles",
      example: '"Find similar but in pastels"',
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "AR Try-On",
      description: "See how clothes look on you before buying",
      example: "Virtual fitting room",
      color: "from-green-400 to-blue-500"
    }
  ];

  const trendingSearches = [
    "Y2K aesthetic outfits",
    "Minimalist work wear",
    "Festival ready looks",
    "Date night casual",
    "Gym to street style",
    "Vintage denim vibes"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Powered Discovery
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fashion in ways you never imagined. Search by vibe, mood, or even your wildest style dreams
          </p>
        </div>

        {/* AI Search Demo */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Try Our AI Style Assistant</h3>
              <p className="text-gray-600">Describe your style, upload an image, or record a voice note</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="e.g., 'Outfits for a rainy day in Bengaluru' or 'Cottagecore but make it urban'"
                  className="pr-20 py-4 text-lg rounded-full border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                    <Mic className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button size="icon" className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Wand2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {trendingSearches.map((search) => (
                  <Badge 
                    key={search} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors"
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* AI Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${feature.color}`}></div>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm text-purple-600 font-medium">{feature.example}</code>
                  </div>

                  <Button 
                    variant="outline" 
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full group-hover:border-purple-400"
                  >
                    Try Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">95%</div>
            <div className="text-sm text-gray-500">Style Match Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">2.3M</div>
            <div className="text-sm text-gray-500">AI Searches Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">15K+</div>
            <div className="text-sm text-gray-500">Brands Indexed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-500">Style Assistant</div>
          </div>
        </div>
      </div>
    </section>
  );
}