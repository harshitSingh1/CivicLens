import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, AlertCircle, Upload, MessageSquare, Search } from 'lucide-react';
import Button from '../components/Button';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Home: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const platformFeatures = [
    {
      title: "Report Issues",
      description: "Easily document problems in your community with photos and location data",
      icon: Upload,
      color: "text-blue-500"
    },
    {
      title: "Track Updates",
      description: "Follow the progress of reported issues and civic projects",
      icon: AlertCircle,
      color: "text-green-500"
    },
    {
      title: "Community Engagement",
      description: "Discuss solutions and upvote important issues",
      icon: MessageSquare,
      color: "text-purple-500"
    },
    {
      title: "Find Information",
      description: "Search for ongoing projects and alerts in your area",
      icon: Search,
      color: "text-orange-500"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create an Account",
      description: "Sign up to start reporting issues and participating in your community"
    },
    {
      step: 2,
      title: "Report an Issue",
      description: "Use our simple form to document problems with photos and location"
    },
    {
      step: 3,
      title: "Track Progress",
      description: "Monitor your reports and see when they're acknowledged or resolved"
    },
    {
      step: 4,
      title: "Engage with Others",
      description: "Comment on issues, upvote important ones, and see civic updates"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 overflow-hidden text-white bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[length:70px_70px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                Your Voice Shapes
                <span className="block text-yellow-400">Your Community</span>
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl"
              >
                CivicLens empowers you to document issues, track civic projects, and engage with your local community through our intuitive platform.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link to="/about">
                  <Button size="lg" className="w-full px-8 py-4 text-lg sm:w-auto">
                    Know About Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/map">
                  <Button variant="outline" size="lg" className="w-full px-8 py-4 text-lg text-white border-white sm:w-auto hover:bg-white hover:text-blue-700">
                    View Issues Map
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="p-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
                <img 
                  src="/hero.gif" 
                  alt="CivicLens platform preview" 
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              What You Can Do With CivicLens
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Our platform provides powerful tools to engage with your community and local authorities
            </p>
          </motion.div>
          
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {platformFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="p-6 transition-all bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md"
              >
                <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-opacity-20 ${feature.color.replace('text-', 'bg-')}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              How CivicLens Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              A simple process to make your community better
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 right-0 h-1 transform -translate-y-1/2 bg-gray-200 top-1/2 dark:bg-gray-700 md:left-16 md:right-16"></div>
            
            <div className="space-y-12 md:space-y-0">
              {howItWorks.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold text-white bg-blue-600 rounded-full md:mb-0">
                    {step.step}
                  </div>
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                    <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Page Guide Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Explore Our Platform
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Learn how to navigate CivicLens and make the most of its features
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Reporting Issues
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Upload photos of the problem</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Automatically capture location or enter manually</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Select category and severity level</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link to="/report">
                    <Button variant="outline" className="w-full">
                      Try Reporting Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Viewing Issues & Updates
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Interactive map shows all reported issues</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Filter by category, status, or severity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>See civic updates for your area</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link to="/map">
                    <Button variant="outline" className="w-full">
                      Explore Map View
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Community Engagement
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Upvote important issues to prioritize them</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Add comments with additional information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" />
                    <span>Track resolution progress on your reports</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link to="/community">
                    <Button variant="outline" className="w-full">
                      Join Community
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Ready to Make an Impact?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-8 text-xl text-blue-100"
          >
            Join thousands of active citizens improving their communities every day
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link to="/contact">
              <Button size="lg" className="px-8 py-4 !text-blue-600 bg-white hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;