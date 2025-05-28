
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import PricingCard from '@/components/pricing/PricingCard';
import { Car, Bus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Pricing data
const pricingOptions_eng = [
  {
    title: "Category A & A1",
    price: "€599",
    description: "Perfect for motorcycle enthusiasts",
    features: [
      { text: "20 hours of theory", included: true },
      { text: "15 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Weekend lessons available", included: true },
      { text: "Motorcycle provided", included: true },
      { text: "Personal instructor", included: true },
      { text: "Free retake if you fail exam", included: false },
    ],
    popular: false,
    ctaLink: "/pricing/category-a",
  },
  {
    title: "Category B",
    price: "€799",
    description: "Our most popular car driver's license",
    features: [
      { text: "30 hours of theory", included: true },
      { text: "25 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Weekend lessons available", included: true },
      { text: "Car provided for exams", included: true },
      { text: "Personal instructor", included: true },
      { text: "Free retake if you fail exam", included: true },
    ],
    popular: true,
    ctaLink: "/pricing/category-b",
  },
  {
    title: "Category C & CE",
    price: "€999",
    description: "Professional truck driver qualifications",
    features: [
      { text: "40 hours of theory", included: true },
      { text: "30 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Weekend lessons available", included: false },
      { text: "Truck provided for training", included: true },
      { text: "Personal instructor", included: true },
      { text: "Free retake if you fail exam", included: true },
    ],
    popular: false,
    ctaLink: "/pricing/category-c",
  }
];

const pricingOptions = [
  {
    title: "Категорії A та A1",
    price: "15 000 UAH",
    description: "Ідеально для любителів мотоциклів",
    features: [
      { text: "20 годин теорії", included: true },
      { text: "15 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: true },
      { text: "Мотоцикл надається", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: false },
    ],
    popular: false,
    ctaLink: "/register",
  },
  {
    title: "Категорія B",
    price: "25 000 UAH",
    description: "Найпопулярніша категорія водійських прав",
    features: [
      { text: "30 годин теорії", included: true },
      { text: "25 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: true },
      { text: "Авто надається на іспит", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: true },
    ],
    popular: true,
    ctaLink: "/register",
  },
  {
    title: "Категорії C та CE",
    price: "17 500 UAH",
    description: "Кваліфікація професійного водія вантажівки",
    features: [
      { text: "40 годин теорії", included: true },
      { text: "30 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: false },
      { text: "Вантажівка надається для навчання", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: true },
    ],
    popular: false,
    ctaLink: "/register",
  }
];


// License categories for the grid
const licenses = [
  {
    id: 'a',
    name: 'Category A',
    description: 'Motorcycle License',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing/category-a'
  },
  {
    id: 'b',
    name: 'Category B',
    description: 'Car License',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing/category-b'
  },
  {
    id: 'c',
    name: 'Category C',
    description: 'Truck License',
    icon: <Car size={40} className="text-lider-red" />,
    link: '/pricing/category-c'
  },
  {
    id: 'd',
    name: 'Category D',
    description: 'Bus License',
    icon: <Bus size={40} className="text-lider-red" />,
    link: '/pricing/category-c'
  }
];

const Pricing = () => {
  return (
    <PageLayout>
      <PageHeader 
        // title="Our Pricing" 
        // subtitle="Choose from our range of driving courses to match your needs and budget"

        title='Ціни на курси'
        subtitle='Обирайте з нашого асортименту курсів водіння, те що відповідає вашим потребам та бюджету'
      />
      
      {/* License Categories Grid */}
      {/* <section className="container-custom mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Категорії 
        </h2>
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
                    View Details
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>  */}
       
      {/* Pricing Table */}
      <section className="container-custom mb-20">
        {/* <h2 className="text-2xl font-bold mb-8 text-center">Pricing Plans</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard 
              key={index}
              title={option.title}
              price={option.price}
              description={option.description}
              features={option.features}
              popular={option.popular}
              ctaLink={option.ctaLink}
            />
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-secondary py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Потрібно більше інформації?
            {/* Ready to Start Your Journey? */}
            </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            {/* Join thousands of satisfied students who have successfully obtained their driver's license with LIDER Driving School. */}
            Приєднуйтесь до тисяч задоволених студентів, які успішно отримали свої водійські права в автошколі DREAM.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-block">
              Зв'язатися з нами
            </Link>
            <Link to="/branches" className="btn-outline inline-block">
              Переглянути філії
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
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

export default Pricing;
