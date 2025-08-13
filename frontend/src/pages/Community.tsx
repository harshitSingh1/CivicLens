import React, { useState } from 'react';
import { Trophy, Star, Medal, Award, Crown, Zap, Calendar, Users, TrendingUp } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import Button from '../components/Button';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'challenges'>('leaderboard');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');

  const badges = [
    {
      id: 1,
      name: 'First Report',
      description: 'Submit your first community issue report',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      requirement: '1 report',
      rarity: 'Common'
    },
    {
      id: 2,
      name: 'Community Hero',
      description: 'Submit 10 verified issue reports',
      icon: Medal,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      requirement: '10 reports',
      rarity: 'Uncommon'
    },
    {
      id: 3,
      name: 'Photo Pro',
      description: 'Include high-quality photos in 20 reports',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      requirement: '20 photo reports',
      rarity: 'Rare'
    },
    {
      id: 4,
      name: 'Night Owl',
      description: 'Report issues during night hours (10 PM - 6 AM)',
      icon: Crown,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      requirement: '5 night reports',
      rarity: 'Uncommon'
    },
    {
      id: 5,
      name: 'Resolver',
      description: 'Follow up on 5 resolved issues',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      requirement: '5 follow-ups',
      rarity: 'Rare'
    },
    {
      id: 6,
      name: 'Top Contributor',
      description: 'Be in the top 10 contributors for a month',
      icon: Trophy,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      requirement: 'Top 10 monthly',
      rarity: 'Epic'
    }
  ];

  const challenges = [
    {
      id: 1,
      title: 'January Clean-Up Drive',
      description: 'Report waste management issues to help clean up our community',
      progress: 78,
      target: 100,
      reward: '500 points + Clean-Up Champion badge',
      timeLeft: '5 days',
      participants: 234
    },
    {
      id: 2,
      title: 'Street Light Safety Week',
      description: 'Help identify broken or dim street lights in your area',
      progress: 45,
      target: 75,
      reward: '300 points + Night Guardian badge',
      timeLeft: '12 days',
      participants: 156
    },
    {
      id: 3,
      title: 'Pothole Patrol',
      description: 'Document road conditions to improve infrastructure',
      progress: 23,
      target: 50,
      reward: '400 points + Road Warrior badge',
      timeLeft: '18 days',
      participants: 89
    }
  ];

  const sortedUsers = [...mockUsers].sort((a, b) => b.points - a.points);

  const getLevelInfo = (level: number) => {
    const levels = {
      1: { name: 'Newbie', color: 'text-gray-600', bgColor: 'bg-gray-100' },
      2: { name: 'Reporter', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      3: { name: 'Advocate', color: 'text-purple-600', bgColor: 'bg-purple-100' },
      4: { name: 'Champion', color: 'text-orange-600', bgColor: 'bg-orange-100' },
      5: { name: 'Legend', color: 'text-red-600', bgColor: 'bg-red-100' }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600';
      case 'Uncommon': return 'text-green-600';
      case 'Rare': return 'text-blue-600';
      case 'Epic': return 'text-purple-600';
      case 'Legendary': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with fellow citizens, earn rewards, and make your community a better place to live.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-8 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'challenges', label: 'Challenges', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                {(['weekly', 'monthly', 'all-time'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="capitalize"
                  >
                    {range.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top 3 */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    Top Contributors
                  </h3>
                  <div className="flex justify-center items-end space-x-4 mb-8">
                    {sortedUsers.slice(0, 3).map((user, index) => {
                      const position = index + 1;
                      const heights = ['h-32', 'h-40', 'h-28'];
                      const trophyColors = ['text-yellow-500', 'text-gray-400', 'text-orange-500'];
                      
                      return (
                        <div key={user.id} className="text-center">
                          <div className={`${heights[index]} bg-gradient-to-t ${
                            position === 1 ? 'from-yellow-400 to-yellow-500' :
                            position === 2 ? 'from-gray-300 to-gray-400' :
                            'from-orange-400 to-orange-500'
                          } rounded-t-lg flex flex-col justify-end p-4 min-w-[120px]`}>
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-white"
                            />
                            <div className="text-white font-bold">#{position}</div>
                          </div>
                          <div className="bg-white dark:bg-gray-700 p-3 rounded-b-lg border-x border-b border-gray-200 dark:border-gray-600">
                            <Trophy className={`h-6 w-6 mx-auto mb-1 ${trophyColors[index]}`} />
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {user.name}
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 font-bold">
                              {user.points} pts
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Full Rankings
                  </h3>
                  <div className="space-y-3">
                    {sortedUsers.map((user, index) => {
                      const levelInfo = getLevelInfo(user.level);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-gray-500 dark:text-gray-400 w-6">
                              #{index + 1}
                            </div>
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}>
                                {levelInfo.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600 dark:text-blue-400">
                              {user.points}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.reportsCount} reports
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Achievement Badges
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Unlock badges by contributing to your community in different ways
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${badge.bgColor}`}>
                      <badge.icon className={`h-6 w-6 ${badge.color}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {badge.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {badge.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Requirement: {badge.requirement}
                    </span>
                    <Button size="sm" variant="outline">
                      View Progress
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Community Challenges
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Join ongoing challenges to earn extra points and exclusive badges
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {challenge.description}
                      </p>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      {challenge.timeLeft} left
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Reward: {challenge.reward}
                    </div>
                  </div>

                  <Button className="w-full">
                    Join Challenge
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;