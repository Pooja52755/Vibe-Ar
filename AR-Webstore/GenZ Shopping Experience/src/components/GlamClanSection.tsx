import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users, Crown, TrendingUp, Award } from "lucide-react";

export function GlamClanSection() {
  const topCreators = [
    {
      name: "Sarah Chen",
      handle: "@sarahstyles",
      followers: "125K",
      avatar: "SC",
      badge: "Fashion Icon",
      earnings: "₹2.5L",
      engagement: "8.5%"
    },
    {
      name: "Arjun Mehta", 
      handle: "@streetking",
      followers: "89K",
      avatar: "AM",
      badge: "Street Style",
      earnings: "₹1.8L",
      engagement: "12.3%"
    },
    {
      name: "Priya Sharma",
      handle: "@bohovibes",
      followers: "156K",
      avatar: "PS",
      badge: "Trendsetter",
      earnings: "₹3.2L",
      engagement: "15.7%"
    }
  ];

  const challenges = [
    {
      title: "#RainyDayFits",
      participants: "45K",
      prize: "₹50K",
      timeLeft: "5 days",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "#SustainableFashion",
      participants: "32K", 
      prize: "₹75K",
      timeLeft: "12 days",
      color: "from-green-400 to-green-600"
    },
    {
      title: "#VintageVibes",
      participants: "28K",
      prize: "₹40K", 
      timeLeft: "8 days",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-pink-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              GlamClan Community
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our creator community, participate in style challenges, and earn rewards for your authentic fashion content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Top Creators */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Award className="h-5 w-5 text-pink-600" />
              <h3 className="text-2xl font-bold text-gray-900">Top Creators This Month</h3>
            </div>
            
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <Card key={creator.handle} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/placeholder-avatar-${index + 1}.jpg`} />
                            <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                              {creator.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Crown className="h-2 w-2 text-yellow-800" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900">{creator.name}</h4>
                          <p className="text-sm text-gray-500">{creator.handle}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className="mb-1 bg-pink-100 text-pink-700 hover:bg-pink-200">
                          {creator.badge}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {creator.followers} followers • {creator.engagement} engagement
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {creator.earnings} earned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full">
              <Users className="h-4 w-4 mr-2" />
              Join Creator Program
            </Button>
          </div>

          {/* Style Challenges */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-pink-600" />
              <h3 className="text-2xl font-bold text-gray-900">Active Style Challenges</h3>
            </div>

            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-2 bg-gradient-to-r ${challenge.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{challenge.title}</h4>
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        {challenge.timeLeft} left
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{challenge.participants}</div>
                        <div className="text-sm text-gray-500">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{challenge.prize}</div>
                        <div className="text-sm text-gray-500">Prize Pool</div>
                      </div>
                    </div>

                    <Button className="w-full bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full">
                      Participate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">Create Your Own Challenge</h4>
              <p className="text-sm text-gray-600 mb-4">
                Start a style challenge and earn from participant engagement
              </p>
              <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 rounded-full">
                Start Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}