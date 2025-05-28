
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-lider-red relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-full"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ропочнемо навчання прямо зараз?
            {/* Ready to Start Your Driving Journey? */}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {/* Join thousands of successful drivers who started their journey with DREAM Drive School. */}
            Приєднуйтесь до тисяч успішних водіїв, які розпочали свій шлях з автошколи DREAM.
          </p>
          <Link to="/pricing">
            <Button className="bg-black hover:bg-black/80 text-white text-lg px-8 py-6 rounded-xl flex items-center space-x-2 shadow-xl mx-auto">
              <span>Записатися</span>
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
