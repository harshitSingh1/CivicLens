import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Users, Target, Lightbulb, Send } from 'lucide-react';
import Button from '../components/Button';

const About: React.FC = () => {
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former city planner with 10+ years in urban development and civic technology.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      bio: 'AI researcher and full-stack developer passionate about using technology for social good.',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300&h=300'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Community',
      bio: 'Community organizer with extensive experience in civic engagement and public policy.',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300'
    }
  ];

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About CivicLens
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            We're on a mission to bridge the gap between citizens and local governments, 
            making communities more responsive, transparent, and engaged.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower citizens with technology that makes reporting and resolving 
                community issues faster, more transparent, and more engaging than ever before.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A world where every community member has a voice in shaping their 
                neighborhood, and where local governments can respond quickly and effectively.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Transparency, community engagement, and using technology as a force for 
                positive social change in communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How CivicLens Started
            </h2>
          </div>
          
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              CivicLens was born from frustration. Our founders, Alex and Sarah, lived in a neighborhood 
              where potholes went unfixed for months, broken streetlights created safety hazards, and 
              residents felt disconnected from their local government.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Traditional 311 systems were outdated, hard to use, and provided little feedback. 
              Citizens would report issues into a black hole, never knowing if their concerns were 
              being addressed. Meanwhile, local governments struggled with outdated technology and 
              limited resources to track and prioritize community needs.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We realized that AI and modern web technology could bridge this gap. By automatically 
              categorizing issues, providing real-time updates, and gamifying civic engagement, 
              we could create a platform that benefits both citizens and local governments.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Today, CivicLens is used in over 50 cities, has helped resolve thousands of community 
              issues, and continues to grow as more communities discover the power of engaged, 
              tech-enabled civic participation.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The people behind CivicLens are passionate about civic technology and community building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Have questions, feedback, or want to bring CivicLens to your community?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">hello@civiclens.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Innovation Drive<br />
                        Tech City, TC 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  For Local Governments
                </h4>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Interested in implementing CivicLens in your city? We'd love to show you how 
                  our platform can help improve citizen engagement and streamline issue resolution.
                </p>
                <Link to="/contact/government">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="government">Government Implementation</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;