
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import LicenseCategories from '@/components/home/LicenseCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import LicenseTimeline from '@/components/home/LicenseTimeline';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection />
        <LicenseCategories />
        <WhyChooseUs />
        <LicenseTimeline />
        <TestimonialsCarousel />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
