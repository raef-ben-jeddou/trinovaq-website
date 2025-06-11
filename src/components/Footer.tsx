
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">TrinovaQ</span>
            </div>
            <p className="text-slate-400 max-w-xs">
              AI-powered security for automotive embedded software development.
              Early detection of vulnerabilities that other tools miss.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#product" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="text-slate-400 hover:text-white transition-colors">Use Cases</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-500 mb-4 md:mb-0">
            © {currentYear} TrinovaQ Technologies. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
