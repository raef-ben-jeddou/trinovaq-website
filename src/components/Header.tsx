import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-brand-dark/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* Replace the previous <div> and <span> code with this image tag */}
          <img 
            src="/public/trinovaq_logo.jpg" 
            alt="TrinovaQ Logo" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Product</Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Technology</Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Company</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/request-access" className="text-sm font-medium text-white hover:text-brand-cyan transition-colors">
            Sign In
          </Link>
          <Button asChild className="bg-white text-brand-dark hover:bg-brand-cyan hover:text-brand-dark transition-all">
            <Link to="/request-access">Request Demo</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Menu (Simple implementation) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-dark border-b border-white/10 p-4 flex flex-col gap-4 md:hidden">
           <Link to="/" className="text-sm font-medium text-white">Product</Link>
           <Button asChild className="w-full bg-brand-cyan text-brand-dark">
            <Link to="/request-access">Request Demo</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;