import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Map, Trophy, Zap, CheckCircle, Users, Star, ArrowRight, Play } from 'lucide-react';
import Button from '../components/Button';
import { testimonials } from '../data/mockData';

const Home: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Issue Detection',
      description: 'Smart categorization and priority assessment using advanced AI algorithms.'
    },
    {
      icon: Map,
      title: 'Real-Time Mapping',
      description: 'Interactive maps showing all reported issues with live status updates.'
    },
    {
      icon: Trophy,
      title: 'Gamified Reporting',
      description: 'Earn points, badges, and level up by contributing to your community.'
    },
    {
      icon: Zap,
      title: 'Automated Escalation',
      description: 'Critical issues are automatically forwarded to relevant authorities.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Issues Resolved' },
    { number: '50+', label: 'Cities Using CivicLens' },
    { number: '95%', label: 'User Satisfaction' },
    { number: '3.2 days', label: 'Avg. Resolution Time' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Fix Your City,
                <span className="block text-yellow-400">One Report at a Time</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Empower your community with AI-driven civic engagement. Report issues, track progress, 
                and make your neighborhood a better place to live.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/report">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    Report an Issue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-700">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img 
                  src="https://images.pexels.com/photos/7428165/pexels-photo-7428165.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Issue reporting in action" 
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="mt-6 flex items-center justify-center">
                  <Button variant="ghost" className="text-white hover:bg-white/20">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Better Communities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CivicLens combines cutting-edge technology with community engagement to create 
              lasting positive change in your neighborhood.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens already using CivicLens to improve their communities. 
            Your voice matters, and every report counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                Start Reporting
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                Explore Issues
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from real people making a difference in their communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;