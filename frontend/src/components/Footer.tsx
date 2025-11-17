import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4 space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CivicLens</span>
            </div>
            <p className="max-w-md mb-6 text-gray-300">
              Empowering communities to report, track, and resolve local issues using AI. 
              Building stronger neighborhoods through civic engagement.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 transition-colors hover:text-white">Our Vision</Link></li>
              <li><Link to="/report" className="text-gray-300 transition-colors hover:text-white">Report Issue</Link></li>
              <li><Link to="/map" className="text-gray-300 transition-colors hover:text-white">Map View</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 transition-colors hover:text-white">Dashboard</Link></li>
              <li><Link to="/updates" className="text-gray-300 transition-colors hover:text-white">Civic Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300">hello@civiclens.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-800 md:flex-row">
          <p className="text-sm text-gray-300">
            © 2025 CivicLens. All rights reserved.
          </p>
          <div className="flex mt-4 space-x-6 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-300 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-300 transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;