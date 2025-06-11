
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Demo Request Submitted",
        description: "Thank you for your interest! Our team will contact you shortly.",
      });
      
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your Automotive Software?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Request a personalized demo to see how TrinovaQ integrates with your
              development ecosystem and catches vulnerabilities other tools miss.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="bg-white/20 border-white/20 text-white placeholder:text-blue-100/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Work Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="bg-white/20 border-white/20 text-white placeholder:text-blue-100/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="bg-white/20 border-white/20 text-white placeholder:text-blue-100/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">What automotive systems are you developing?</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your security needs and current development workflow"
                  className="bg-white/20 border-white/20 text-white h-32 placeholder:text-blue-100/50"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-6"
                >
                  {isSubmitting ? 'Submitting...' : 'Request a Demo'}
                </Button>
                <p className="text-sm text-blue-100/60 text-center mt-4">
                  No commitment required. We'll respond within 24 hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
