
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Code, ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-background via-blue-50/30 to-cyan-50/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <Code className="w-8 h-8 text-cyan-600" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Detect Hidden Vulnerabilities in Automotive Software
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            AI-powered security analysis that integrates seamlessly into your CI/CD pipeline, 
            helping embedded software teams catch vulnerabilities early in development.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-6"
            >
              Request Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-2"
            >
              Get Early Access
            </Button>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
            <div className="bg-slate-900 rounded-lg p-6 text-left overflow-hidden">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 text-sm ml-4">vulnerability_scan.c</span>
              </div>
              <div className="text-green-400 font-mono text-sm space-y-1">
                <div className="text-slate-500">// TrinovaQ AI Analysis</div>
                <div><span className="text-red-400">WARNING:</span> Buffer overflow vulnerability detected</div>
                <div><span className="text-yellow-400">Line 47:</span> Unchecked input bounds in CAN message handler</div>
                <div><span className="text-blue-400">Severity:</span> High - Remote code execution possible</div>
                <div className="text-cyan-400">✓ Fix suggested: Add input validation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
