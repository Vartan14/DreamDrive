
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Bus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const licenses = [
  {
    id: 'a',
    name: 'Категорія A',
    description: 'Мотоцикли і скутери',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing#a'
  },
  {
    id: 'b',
    name: 'Категорія B',
    description: 'Легковий автомобіль',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing#b'
  },
  {
    id: 'c',
    name: 'Категорія C',
    description: 'Вантажний автомобіль',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing#c'
  },
  {
    id: 'd',
    name: 'Категорія D',
    description: 'Автобус',
    icon: <Bus size={40} className="text-lider-red" />,
    link: '/pricing#d'
  }
];

const LicenseCategories = () => {
  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg">Категорії</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
             Ми пропонуємо навчання для отримання всіх категорій водійських посвідчень, щоб допомогти вам досягти ваших цілей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenses.map((license) => (
            <Link key={license.id} to={license.link} className="group">
              <Card className="bg-secondary border-gray-700 hover:border-lider-red/50 transition-all duration-300 h-full group-hover:translate-y-[-5px]">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 rounded-full bg-black/50 group-hover:bg-black/70 transition-colors">
                    {license.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{license.name}</h3>
                  <p className="text-gray-300">{license.description}</p>
                  
                  <span className="mt-4 text-lider-red font-semibold inline-flex items-center">
                    Переглянути ціни
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}

export default LicenseCategories;
