import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-pink-400">AURAFIT</div>
            <p className="text-gray-400 text-sm">
              Discover your style, express your vibe. Join millions of GenZ creators in the ultimate fashion community.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-400">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-400">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-pink-400">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Men</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Women</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Kids</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Home & Living</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Beauty</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-pink-400 transition-colors">GlamClan</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Style Challenges</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Creator Program</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Fashion Tips</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Trend Reports</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Style Forums</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-400">
              Get the latest trends, challenges, and exclusive offers delivered to your inbox.
            </p>
            <div className="space-y-2">
              <Input 
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-pink-400"
              />
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 AURAFIT. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-pink-400 transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}