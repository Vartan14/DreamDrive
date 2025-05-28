
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import PricingCard from '@/components/pricing/PricingCard';
import { Check, Clock, CalendarDays, User, FileText, Award } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const features = [
  {
    icon: <User size={20} className="text-lider-red" />,
    title: "Who This Is For",
    description: "Individuals who want to ride motorcycles or scooters. Category A is for standard motorcycles, while A1 is restricted to lighter motorcycles and scooters."
  },
  {
    icon: <FileText size={20} className="text-lider-red" />,
    title: "Requirements",
    description: "Minimum age: 16 for A1, 18 for A. Valid ID or passport. Medical certificate."
  },
  {
    icon: <Clock size={20} className="text-lider-red" />,
    title: "Course Duration",
    description: "20 hours of theory and 15 practical lessons (approximately 4-6 weeks to complete)."
  },
  {
    icon: <CalendarDays size={20} className="text-lider-red" />,
    title: "Flexible Schedule",
    description: "Choose between weekday or weekend classes to fit your busy schedule."
  },
  {
    icon: <Award size={20} className="text-lider-red" />,
    title: "Certification",
    description: "Upon completion, you'll be fully prepared for both the theoretical and practical exams."
  }
];

const pricingOptions = [
  {
    title: "Category A1",
    price: "€499",
    description: "For light motorcycles up to 125cc",
    features: [
      { text: "20 hours of theory", included: true },
      { text: "12 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Light motorcycle provided", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: false },
      { text: "Free retake if you fail exam", included: false },
    ]
  },
  {
    title: "Category A Standard",
    price: "€599",
    description: "For all motorcycle types",
    features: [
      { text: "20 hours of theory", included: true },
      { text: "15 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Motorcycle provided", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: false },
    ],
    popular: true
  },
  {
    title: "Category A Premium",
    price: "€749",
    description: "Complete package with extra lessons",
    features: [
      { text: "20 hours of theory", included: true },
      { text: "20 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Motorcycle provided", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: true },
    ]
  }
];

const faqItems = [
  {
    question: "What's the difference between A and A1 category?",
    answer: "Category A1 is restricted to motorcycles with an engine capacity not exceeding 125cc and power not exceeding 11kW. Category A allows you to ride any motorcycle without restriction."
  },
  {
    question: "How long does it take to get a motorcycle license?",
    answer: "On average, it takes 4-6 weeks to complete the course, but this can vary based on your availability for lessons and how quickly you learn."
  },
  {
    question: "Do I need my own motorcycle for the lessons?",
    answer: "No, we provide motorcycles for all practical lessons. However, you're welcome to use your own if it meets the requirements for the category you're training for."
  },
  {
    question: "What should I wear for motorcycle lessons?",
    answer: "We provide helmets, but you should wear sturdy boots that cover your ankles, long pants, a jacket, and gloves. Safety gear is essential for your protection."
  },
  {
    question: "If I already have a car license, do I need to take the theory again?",
    answer: "If your car license is less than 2 years old, you may be exempt from the theory portion. Please contact us to verify your specific situation."
  }
];

const CategoryA = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-secondary border-b border-gray-800">
        <div className="container-custom py-20 md:py-28">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h1 className="heading-lg mb-4">Category A & A1 Motorcycle License</h1>
              <p className="text-gray-300 mb-6">
                Get ready to hit the road on two wheels with our comprehensive motorcycle training program. Whether you're looking to ride a scooter or a powerful motorcycle, we have the perfect course for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">
                  Enroll Now
                </Link>
                <Link to="/pricing" className="btn-outline">
                  View All Prices
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-black p-2 rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1558979159-2b18a4070a87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Motorcycle training" 
                  className="w-full h-auto rounded object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <section className="container-custom py-16">
        <h2 className="heading-md mb-10 text-center">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-feature p-6">
              <div className="flex items-start mb-4">
                <div className="rounded-full bg-lider-red/10 p-3 mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Course Structure */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <h2 className="heading-md mb-10 text-center">Course Structure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Theoretical Training */}
            <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="bg-lider-red/20 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                  <span className="text-lider-red">1</span>
                </div>
                Theoretical Training
              </h3>
              <p className="text-gray-300 mb-4">
                You'll start with our comprehensive theory course that covers:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Traffic rules and regulations</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Motorcycle controls and operation</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Safety techniques and defensive riding</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Understanding road signs and markings</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Special considerations for motorcyclists</span>
                </li>
              </ul>
            </div>
            
            {/* Practical Training */}
            <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="bg-lider-red/20 w-8 h-8 flex items-center justify-center rounded-full mr-3">
                  <span className="text-lider-red">2</span>
                </div>
                Practical Training
              </h3>
              <p className="text-gray-300 mb-4">
                After completing the theory, you'll move on to hands-on riding lessons:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Basic motorcycle control in closed area</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Mastering complex maneuvers</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>City riding skills</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Highway and rural road experience</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Emergency procedures and techniques</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="container-custom py-16">
        <h2 className="heading-md mb-10 text-center">Our Pricing Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard 
              key={index}
              title={option.title}
              price={option.price}
              description={option.description}
              features={option.features}
              popular={option.popular}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-300 mb-6">
            All prices include study materials and motorcycle rental during lessons.
            Additional lessons can be purchased separately if needed.
          </p>
          <Link to="/contact" className="btn-primary">
            Enroll Now
          </Link>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <h2 className="heading-md mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left font-medium py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container-custom py-16">
        <div className="bg-lider-red/10 border border-lider-red/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Your Motorcycle License?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join LIDER Driving School and learn from the best motorcycle instructors in the city.
            Our courses have a 95% first-time pass rate!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Enroll Today
            </Link>
            <Link to="/branches" className="btn-outline">
              Find Nearest Branch
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CategoryA;
