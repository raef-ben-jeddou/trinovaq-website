
import React from 'react';
import { Shield, Code, Users, ArrowRight } from 'lucide-react';

const ProductBenefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Early Vulnerability Detection",
      description: "Catch security issues before they reach production with AI-powered static analysis that understands automotive-specific threat patterns."
    },
    {
      icon: Code,
      title: "Seamless CI/CD Integration",
      description: "Deploy in minutes with native support for Jenkins, GitLab CI, and other popular development tools. No workflow disruption required."
    },
    {
      icon: Users,
      title: "Team-Friendly Insights",
      description: "Clear, actionable reports that both security experts and embedded developers can understand and act upon immediately."
    }
  ];

  return (
    <section id="product" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Secure Your Automotive Software Stack
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From ECU firmware to ADAS systems, TrinovaQ provides comprehensive security analysis 
            tailored for the unique challenges of automotive embedded software development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBenefits;
