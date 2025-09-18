import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users, TrendingUp, Award, MessageCircle, Heart, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CommunitySection() {
  const topCreators = [
    {
      name: "Sarah Chen",
      handle: "@sarahstyles",
      followers: "125K",
      avatar: "SC",
      badge: "Fashion Guru",
      posts: 342,
      engagement: "8.5%"
    },
    {
      name: "Arjun Mehta", 
      handle: "@streetking",
      followers: "89K",
      avatar: "AM",
      badge: "Street Style",
      posts: 256,
      engagement: "12.3%"
    },
    {
      name: "Priya Sharma",
      handle: "@bohovibes",
      followers: "156K",
      avatar: "PS",
      badge: "Trendsetter",
      posts: 478,
      engagement: "15.7%"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      user: "Sarah Chen",
      handle: "@sarahstyles",
      content: "Perfect rainy day outfit! This oversized sweater + cargo pants combo is giving me all the cozy vibes 🌧️✨",
      image: "https://images.unsplash.com/photo-1609681780826-e484497a971d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTc5MzA1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 1.2,
      comments: 89,
      timeAgo: "2h"
    },
    {
      id: 2,
      user: "Arjun Mehta",
      handle: "@streetking", 
      content: "Y2K is officially back! Found these platform sneakers and I'm obsessed. The chunky sole trend is everything 🔥",
      image: "https://images.unsplash.com/photo-1678802910315-b1bf6ca9f6a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9lcyUyMHNuZWFrZXJzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTgwMTYyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 2.1,
      comments: 156,
      timeAgo: "4h"
    }
  ];

  const challenges = [
    {
      title: "#SustainableFits",
      participants: "32K",
      description: "Show us your eco-friendly outfit choices",
      timeLeft: "12 days",
      color: "from-green-400 to-green-600"
    },
    {
      title: "#VintageVibes", 
      participants: "28K",
      description: "Style challenge: mix vintage with modern",
      timeLeft: "8 days", 
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="h-8 w-8 text-pink-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Style Communities
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow fashion enthusiasts, share your style, and discover trending looks from creators worldwide
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Creators */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Award className="h-5 w-5 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-900">Top Creators</h3>
            </div>
            
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <Card key={creator.handle} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder-avatar-${index + 1}.jpg`} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                          {creator.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{creator.name}</h4>
                        <p className="text-sm text-gray-500">{creator.handle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="text-xs bg-pink-100 text-pink-700">
                            {creator.badge}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right text-sm">
                        <div className="font-medium">{creator.followers}</div>
                        <div className="text-gray-500">followers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Join Community
            </Button>
          </div>

          {/* Community Feed */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-900">Community Feed</h3>
            </div>

            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-sm">
                          {post.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.user}</h4>
                        <p className="text-xs text-gray-500">{post.handle} • {post.timeAgo}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                    
                    <ImageWithFallback
                      src={post.image}
                      alt="Community post"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 hover:text-pink-600">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}K</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-pink-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <button className="hover:text-pink-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Style Challenges */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-900">Style Challenges</h3>
            </div>

            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-2 bg-gradient-to-r ${challenge.color}`}></div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{challenge.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-gray-500">{challenge.participants} participants</span>
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        {challenge.timeLeft} left
                      </Badge>
                    </div>

                    <Button size="sm" className="w-full bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50">
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">Start Your Challenge</h4>
              <p className="text-sm text-gray-600 mb-3">
                Create a style challenge and watch the community bring it to life
              </p>
              <Button size="sm" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                Create Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}