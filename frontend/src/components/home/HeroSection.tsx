
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16">
      {/* Background overlay with gradient */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black to-black" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          opacity: 0.5
        }}
      ></div>
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Start Your <span className="text-lider-red">Driving Journey</span> Today
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            {/* Professional instruction, flexible schedules, and modern vehicles. 
            Get your driver's license with confidence. */}
            Професійне навчання, гнучкий графік та сучасні транспортні засоби. Отримайте водійські права з упевненістю.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/pricing">
              <Button className="btn-primary text-lg px-8 py-6 rounded-xl flex items-center space-x-2 shadow-xl">
                <span>Записатися</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="btn-outline text-lg px-8 py-6 rounded-xl">
                Дізнатися більше
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
