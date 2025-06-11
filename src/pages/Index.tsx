
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductBenefits from '@/components/ProductBenefits';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProductBenefits />
        <HowItWorks />
        <UseCases />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
