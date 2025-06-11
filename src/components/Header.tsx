
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">TrinovaQ</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('product')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Request Demo
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('product')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                Product
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full"
              >
                Request Demo
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
