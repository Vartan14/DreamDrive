
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
    description: "Individuals seeking to drive commercial trucks and vehicles over 3500kg. Perfect for those pursuing a career in logistics, delivery, or commercial transportation."
  },
  {
    icon: <FileText size={20} className="text-lider-red" />,
    title: "Requirements",
    description: "Minimum age: 21 years. Must already hold a Category B license for at least 2 years. Valid ID or passport. Medical certificate confirming fitness to drive commercially."
  },
  {
    icon: <Clock size={20} className="text-lider-red" />,
    title: "Course Duration",
    description: "40 hours of theory and 30 practical lessons (approximately 8-10 weeks to complete)."
  },
  {
    icon: <CalendarDays size={20} className="text-lider-red" />,
    title: "Flexible Schedule",
    description: "Courses designed for working adults with weekend options available."
  },
  {
    icon: <Award size={20} className="text-lider-red" />,
    title: "Professional Certification",
    description: "Includes professional driver qualification and certification required for commercial driving careers."
  }
];

const pricingOptions = [
  {
    title: "Category C Standard",
    price: "€999",
    description: "Complete truck license training",
    features: [
      { text: "40 hours of theory", included: true },
      { text: "30 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Training truck provided", included: true },
      { text: "Professional instructor", included: true },
      { text: "Weekend lessons", included: false },
      { text: "Free retake if you fail exam", included: false },
    ]
  },
  {
    title: "Category C Professional",
    price: "€1199",
    description: "Enhanced package with additional benefits",
    features: [
      { text: "40 hours of theory", included: true },
      { text: "35 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Training truck provided", included: true },
      { text: "Professional instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: true },
    ],
    popular: true
  },
  {
    title: "Category CE (Truck + Trailer)",
    price: "€1499",
    description: "Complete package for truck with trailer license",
    features: [
      { text: "40 hours of theory", included: true },
      { text: "40 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Training vehicles provided", included: true },
      { text: "Professional instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: true },
    ]
  }
];

const faqItems = [
  {
    question: "Is there a medical requirement for Category C licenses?",
    answer: "Yes, you'll need to pass a more comprehensive medical examination than for a standard Category B license. This includes vision, hearing, and general health assessments to ensure you're fit to drive commercially."
  },
  {
    question: "Do I need to have my own truck for training?",
    answer: "No, we provide all necessary trucks for training. Our fleet includes various commercial vehicles to give you experience with different types of trucks you may operate professionally."
  },
  {
    question: "What's the difference between Category C and Category CE?",
    answer: "Category C allows you to drive rigid trucks over 3500kg, while Category CE extends this to include trucks with trailers. CE is required for articulated vehicles and truck-trailer combinations."
  },
  {
    question: "Will this course prepare me for professional driving jobs?",
    answer: "Yes, our Category C courses include the Certificate of Professional Competence (CPC) modules required for commercial driving in Ukraine and the EU. We also provide guidance on career opportunities and job placement assistance."
  },
  {
    question: "How long is the Category C license valid?",
    answer: "The license itself is valid for 10 years, however, professional drivers must renew their CPC qualification every 5 years through continuing education courses, which we also offer."
  }
];

const CategoryC = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-secondary border-b border-gray-800">
        <div className="container-custom py-20 md:py-28">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h1 className="heading-lg mb-4">Category C & CE Truck License</h1>
              <p className="text-gray-300 mb-6">
                Take your driving career to the next level with our professional truck driver training. Our Category C courses prepare you for a rewarding career in the transportation industry, with comprehensive training on large commercial vehicles.
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
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Truck driver training" 
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
                Our comprehensive theory course covers specialized topics for commercial drivers:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Commercial vehicle regulations</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Load securing and weight distribution</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Driver hours and tachograph operation</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Safety inspection procedures</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Professional driver responsibilities</span>
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
                Hands-on training focusing on commercial vehicle operation:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Vehicle checks and maintenance awareness</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Maneuvering large vehicles in tight spaces</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>City, rural and highway driving</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Reversing with and without trailers (CE)</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Fuel-efficient driving techniques</span>
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
            All prices include study materials, vehicle usage, and professional certification modules.
            Corporate packages are available for companies training multiple drivers.
          </p>
          <Link to="/contact" className="btn-primary">
            Enroll Now
          </Link>
        </div>
      </section>
      
      {/* Career Benefits */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <h2 className="heading-md mb-10 text-center">Career Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Industry Demand</h3>
              <p className="text-gray-300 mb-4">
                The transportation industry has a consistent high demand for qualified truck drivers, offering:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Competitive starting salaries</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Job security and stability</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Opportunities for domestic and international routes</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Career advancement possibilities</span>
                </li>
              </ul>
            </div>
            <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Job Placement</h3>
              <p className="text-gray-300 mb-4">
                We offer additional support to help you start your professional driving career:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Job market orientation</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>CV and interview preparation</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Partnerships with logistics companies</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Access to job placement services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="container-custom py-16">
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
      </section>
      
      {/* Call to Action */}
      <section className="container-custom py-16">
        <div className="bg-lider-red/10 border border-lider-red/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Professional Driving Career</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Invest in your future with a Category C license from LIDER Driving School.
            Take the first step toward a rewarding career in the transportation industry.
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

export default CategoryC;
