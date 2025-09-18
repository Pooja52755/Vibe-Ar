import { Search, ShoppingBag, Heart, User, Menu, Sparkles, Eye, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onAISearchClick?: () => void;
  onARClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick, onAISearchClick, onARClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Categories */}
          <div className="flex items-center space-x-8">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-2xl font-bold text-pink-600 tracking-tight">
              AURAFIT
            </div>
            
            {/* Categories - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#" className="hover:text-pink-600 transition-colors">MEN</a>
              <a href="#" className="hover:text-pink-600 transition-colors">WOMEN</a>
              <a href="#" className="hover:text-pink-600 transition-colors">KIDS</a>
              <a href="#" className="hover:text-pink-600 transition-colors">HOME & LIVING</a>
              <a href="#" className="hover:text-pink-600 transition-colors">BEAUTY</a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search for products, brands and more..."
                className="pl-10 pr-12 py-2 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-pink-50"
                onClick={onAISearchClick}
              >
                <Sparkles className="h-4 w-4 text-pink-600" />
              </Button>
            </div>
          </div>

          {/* Right side - Navigation and Icons */}
          <div className="flex items-center space-x-4">
            {/* Right Navigation */}
            <nav className="hidden md:flex items-center space-x-6 mr-4">
              <a href="#" className="hover:text-pink-600 transition-colors flex items-center space-x-1">
                <span>Home</span>
              </a>
              <button 
                onClick={onARClick}
                className="hover:text-pink-600 transition-colors flex items-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>TryAR</span>
              </button>
              <button 
                onClick={onAISearchClick}
                className="hover:text-pink-600 transition-colors flex items-center space-x-1"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Search</span>
              </button>
              <a href="#" className="hover:text-pink-600 transition-colors flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Communities</span>
              </a>
            </nav>

            {/* Icons */}
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-pink-500">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search for products, brands and more..."
              className="pl-10 pr-12 py-2 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={onAISearchClick}
            >
              <Sparkles className="h-4 w-4 text-pink-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}