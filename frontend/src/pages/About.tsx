import React, { useEffect } from 'react';
import { Users, Target, Lightbulb} from 'lucide-react';

const About: React.FC = () => {

  const faqs = [
    {
      question: 'How does CivicLens use AI to categorize issues?',
      answer: 'Our AI system analyzes uploaded photos and descriptions to automatically categorize issues, assess priority levels, and route them to the appropriate departments. This reduces response time and ensures issues reach the right people quickly.'
    },
    {
      question: 'Is my personal information safe when reporting issues?',
      answer: 'Yes, we take privacy seriously. You can report issues anonymously, and when you do provide contact information, it\'s encrypted and only shared with relevant authorities for resolution purposes.'
    },
    {
      question: 'How do I know if my reported issue is being addressed?',
      answer: 'You\'ll receive email updates on your issue\'s status. You can also track progress through our dashboard and map view, where you\'ll see status changes from "Open" to "In Progress" to "Resolved".'
    },
    {
      question: 'Can local governments integrate CivicLens with their existing systems?',
      answer: 'Absolutely! We offer API integration and can work with your existing 311 systems, work order management, and citizen engagement platforms. Contact us to discuss your specific needs.'
    },
    {
      question: 'How does the gamification system work?',
      answer: 'Users earn points for reporting issues, providing helpful photos, and engaging with the community. Points unlock badges and levels, encouraging continued participation while making civic engagement more engaging.'
    },
    {
      question: 'Is CivicLens free to use?',
      answer: 'Yes, CivicLens is free for citizens to use. We offer premium features for local governments and organizations who want advanced analytics, custom integrations, and priority support.'
    }
  ];

    useEffect(() => {
       window.scrollTo(0, 0);
    }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            About CivicLens
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-blue-100 md:text-2xl">
            We're on a mission to bridge the gap between citizens and local governments, 
            making communities more responsive, transparent, and engaged.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                To empower citizens with technology that makes reporting and resolving 
                community issues faster, more transparent, and more engaging than ever before.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-900/20">
                <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Our Vision
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                A world where every community member has a voice in shaping their 
                neighborhood, and where local governments can respond quickly and effectively.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full dark:bg-purple-900/20">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Our Values
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Transparency, community engagement, and using technology as a force for 
                positive social change in communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              How CivicLens Started
            </h2>
          </div>
          
          <div className="mx-auto prose prose-lg dark:prose-invert">
            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
              CivicLens was born from frustration. Our founders, Alex and Sarah, lived in a neighborhood 
              where potholes went unfixed for months, broken streetlights created safety hazards, and 
              residents felt disconnected from their local government.
            </p>
            
            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
              Traditional 311 systems were outdated, hard to use, and provided little feedback. 
              Citizens would report issues into a black hole, never knowing if their concerns were 
              being addressed. Meanwhile, local governments struggled with outdated technology and 
              limited resources to track and prioritize community needs.
            </p>
            
            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
              We realized that AI and modern web technology could bridge this gap. By automatically 
              categorizing issues, providing real-time updates, and gamifying civic engagement, 
              we could create a platform that benefits both citizens and local governments.
            </p>
            
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
              Today, CivicLens is used in over 50 cities, has helped resolve thousands of community 
              issues, and continues to grow as more communities discover the power of engaged, 
              tech-enabled civic participation.
            </p>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="p-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-900 rounded-xl dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;