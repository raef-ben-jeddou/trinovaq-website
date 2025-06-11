
import React from 'react';
import { Users, Award, Target } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About TrinovaQ
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded by automotive security experts and AI researchers, we're dedicated to 
            making embedded software development more secure without slowing down innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Expert Team</h3>
            <p className="text-muted-foreground">
              Former automotive security researchers from top OEMs and Tier 1 suppliers, 
              with deep understanding of embedded systems challenges.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Proven Technology</h3>
            <p className="text-muted-foreground">
              AI models trained on millions of lines of automotive code, 
              with validation from real-world vulnerability discoveries.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Industry Focus</h3>
            <p className="text-muted-foreground">
              100% focused on automotive embedded systems, with deep specialization 
              in safety-critical and security-critical applications.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
              As vehicles become increasingly software-defined, the security implications 
              grow exponentially. TrinovaQ exists to ensure that automotive software development 
              can move at the speed of innovation while maintaining the highest security standards.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Security Shouldn't Be a Bottleneck</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI-powered tools integrate with your development workflow, providing 
                  instant feedback without interrupting your team's productivity.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Automotive-Specific Expertise</h4>
                <p className="text-sm text-muted-foreground">
                  Generic security tools miss automotive-specific vulnerabilities. Our focus 
                  on embedded automotive systems means deeper, more relevant analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
