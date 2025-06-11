
import React from 'react';
import { Upload, Search, Shield, Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Integrate",
      description: "Connect TrinovaQ to your existing CI/CD pipeline with our lightweight agent or API integration.",
      details: "Supports Jenkins, GitLab CI, GitHub Actions, and custom build systems"
    },
    {
      icon: Search,
      title: "Analyze",
      description: "Our AI engine scans your embedded C/C++ code for vulnerabilities using automotive-specific threat models.",
      details: "Real-time analysis with zero false positives and contextual understanding"
    },
    {
      icon: Shield,
      title: "Report",
      description: "Receive detailed security reports with prioritized findings and remediation guidance.",
      details: "CVSS scoring, exploit scenarios, and step-by-step fix recommendations"
    },
    {
      icon: Check,
      title: "Remediate",
      description: "Apply suggested fixes and track security improvements across development cycles.",
      details: "Automated fix suggestions and progress tracking dashboard"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How TrinovaQ Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four simple steps to comprehensive automotive software security. 
            Integrate once, secure continuously.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transform translate-x-4 -translate-y-1/2 z-0"></div>
                )}
                
                <div className="bg-card border border-border rounded-xl p-6 relative z-10 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 mb-2">Step {index + 1}</div>
                    <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    <p className="text-xs text-muted-foreground italic">{step.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Integration Example</h3>
            <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
              <div className="text-green-400 font-mono text-sm space-y-1">
                <div className="text-slate-500"># Add to your CI/CD pipeline</div>
                <div><span className="text-blue-400">stages:</span></div>
                <div className="ml-4"><span className="text-yellow-400">- security_scan:</span></div>
                <div className="ml-8"><span className="text-cyan-400">script:</span> trinovaq scan --project embedded_ecu</div>
                <div className="ml-8"><span className="text-cyan-400">artifacts:</span> security_report.json</div>
                <div className="text-slate-500 mt-2"># That's it! Full security analysis in your workflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
