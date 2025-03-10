
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-5xl w-full px-6 py-20 mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mb-6 animate-fade-in">Welcome</span>
        
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Minimalist design meets<br />intuitive experience
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Explore our collection of projects that embody simplicity, functionality, and attention to detail.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link 
            to="/portfolio" 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-900 transition-all duration-300"
          >
            View Portfolio
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link 
            to="/about" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-gray-800 border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
