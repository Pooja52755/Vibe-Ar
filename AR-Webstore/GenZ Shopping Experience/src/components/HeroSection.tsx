import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, Users, Search, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  onAISearchClick: () => void;
  onARClick?: () => void;
}

export function HeroSection({ onAISearchClick, onARClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                <Users className="h-3 w-3 mr-1" />
                Community Driven
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Your Vibe,
                <br />
                Your Style
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Discover fashion that matches your energy. Shop with AI-powered search, try-on with AR, and connect with style communities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
                onClick={onAISearchClick}
              >
                <Search className="h-4 w-4 mr-2" />
                Try AI Search
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3"
                onClick={onARClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                Try AR Experience
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2.5M+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-500">Daily Searches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-500">AI Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756277123994-f79585558b0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB0cmVuZHklMjBvdXRmaXR8ZW58MXx8fHwxNzU3OTQ3MTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fashion Model in Trendy Outfit"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span className="text-sm font-medium">AI Match: 94%</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-sm">Perfect for you!</div>
                    <div className="text-xs text-gray-500">AI Recommendation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}