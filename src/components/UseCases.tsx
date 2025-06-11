
import React from 'react';
import { Car, Cpu, Wifi } from 'lucide-react';

const UseCases = () => {
  const useCases = [
    {
      icon: Car,
      title: "ADAS & Autonomous Systems",
      description: "Secure critical safety systems with specialized analysis for perception, planning, and control software.",
      challenges: [
        "Real-time processing vulnerabilities",
        "Sensor data validation flaws",
        "Machine learning model security"
      ],
      solution: "TrinovaQ identifies timing attack vectors, validates sensor input handling, and ensures ML pipeline integrity."
    },
    {
      icon: Cpu,
      title: "ECU Firmware Security",
      description: "Protect engine control units, transmission controllers, and other critical automotive computers.",
      challenges: [
        "Memory corruption vulnerabilities",
        "Bootloader security gaps",
        "Hardware abstraction layer flaws"
      ],
      solution: "Deep static analysis of low-level code, bootloader verification, and hardware interface validation."
    },
    {
      icon: Wifi,
      title: "Connected Vehicle Systems",
      description: "Secure telematics, infotainment, and over-the-air update mechanisms against cyber threats.",
      challenges: [
        "Network protocol vulnerabilities",
        "Authentication bypass risks",
        "Data privacy violations"
      ],
      solution: "Comprehensive analysis of communication protocols, authentication flows, and data handling practices."
    }
  ];

  return (
    <section id="use-cases" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automotive Use Cases
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From safety-critical ADAS to connected infotainment, TrinovaQ secures 
            every layer of your automotive software stack.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{useCase.title}</h3>
              <p className="text-muted-foreground mb-6">{useCase.description}</p>
              
              <div className="mb-6">
                <h4 className="font-medium text-sm text-red-600 mb-3">Common Security Challenges:</h4>
                <ul className="space-y-2">
                  {useCase.challenges.map((challenge, challengeIndex) => (
                    <li key={challengeIndex} className="text-sm text-muted-foreground flex items-start">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-sm text-green-800 mb-2">TrinovaQ Solution:</h4>
                <p className="text-sm text-green-700">{useCase.solution}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Trusted by Leading Automotive Companies
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto">
              "TrinovaQ helped us identify 15 critical vulnerabilities in our ADAS stack 
              that traditional tools missed. The automotive-specific analysis was exactly what we needed."
            </p>
            <div className="text-slate-400">
              <div className="font-medium">— Head of Security Engineering</div>
              <div className="text-sm">Tier 1 Automotive Supplier (Name withheld under NDA)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
