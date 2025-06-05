
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
    description: "Anyone who wants to drive regular passenger cars. Category B licenses allow you to drive vehicles up to 3500kg with up to 8 passenger seats."
  },
  {
    icon: <FileText size={20} className="text-lider-red" />,
    title: "Requirements",
    description: "Minimum age: 18 years. Valid ID or passport. Medical certificate confirming fitness to drive."
  },
  {
    icon: <Clock size={20} className="text-lider-red" />,
    title: "Course Duration",
    description: "30 hours of theory and 25 practical driving lessons (approximately 6-8 weeks to complete)."
  },
  {
    icon: <CalendarDays size={20} className="text-lider-red" />,
    title: "Flexible Schedule",
    description: "Morning, evening, and weekend classes available to fit any schedule."
  },
  {
    icon: <Award size={20} className="text-lider-red" />,
    title: "Certification",
    description: "Upon completion, you'll be fully prepared for both theoretical and practical driving exams."
  }
];

const pricingOptions = [
  {
    title: "Category B Basic",
    price: "€699",
    description: "Essential training package",
    features: [
      { text: "30 hours of theory", included: true },
      { text: "20 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Car provided for training", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: false },
      { text: "Free retake if you fail exam", included: false },
    ]
  },
  {
    title: "Category B Standard",
    price: "€799",
    description: "Our most popular package",
    features: [
      { text: "30 hours of theory", included: true },
      { text: "25 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Car provided for training", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: true },
    ],
    popular: true
  },
  {
    title: "Category B Premium",
    price: "€949",
    description: "Complete package with extra lessons",
    features: [
      { text: "30 hours of theory", included: true },
      { text: "30 practical lessons", included: true },
      { text: "Practice exam simulations", included: true },
      { text: "Car provided for training", included: true },
      { text: "Personal instructor", included: true },
      { text: "Weekend lessons", included: true },
      { text: "Free retake if you fail exam", included: true },
    ]
  }
];

const faqItems = [
  {
    question: "How many lessons do I need to pass the test?",
    answer: "The standard package includes 25 practical lessons, which is sufficient for most students. However, individual needs vary. Some may be ready after fewer lessons, while others might need additional practice."
  },
  {
    question: "Can I use my own car for lessons?",
    answer: "We recommend using our training vehicles, which are equipped with dual controls for safety. However, if you prefer to use your own car for some lessons after developing basic skills, this can be arranged."
  },
  {
    question: "What happens if I fail my test?",
    answer: "If you fail your test, we provide a comprehensive feedback session to identify areas for improvement. Our Standard and Premium packages include a free retake, while Basic package students can book additional lessons at a discounted rate."
  },
  {
    question: "How long does each driving lesson last?",
    answer: "Each practical driving lesson is 45-60 minutes of actual driving time. We recommend scheduling lessons 2-3 times per week for optimal learning."
  },
  {
    question: "Do you offer intensive courses?",
    answer: "Yes, we offer intensive courses where you can complete your training in 2-3 weeks. These are ideal if you have a tight timeline, but require full-time commitment during that period."
  }
];

const CategoryB = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-secondary border-b border-gray-800">
        <div className="container-custom py-20 md:py-28">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h1 className="heading-lg mb-4">Category B Car License</h1>
              <p className="text-gray-300 mb-6">
                Get your car driver's license with our comprehensive Category B training program. Our experienced instructors will guide you through every step, from theory to practical skills, ensuring you become a confident and safe driver.
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
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Car driver training" 
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
                Our comprehensive theory course covers everything you need to know:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Traffic rules and regulations</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Road signs and markings</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Vehicle controls and operation</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Defensive driving techniques</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Safety procedures and emergency responses</span>
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
                Hands-on driving lessons that build your skills progressively:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Vehicle controls and basic maneuvers</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Urban driving skills</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Highway driving experience</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Parking and complex maneuvers</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-lider-red mr-2 mt-1" />
                  <span>Night driving and adverse weather conditions</span>
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
            All prices include study materials and vehicle usage during lessons.
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
          <h2 className="text-2xl font-bold mb-4">Ready to Get Your Driver's License?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join LIDER Driving School and learn from the best instructors in the city.
            Our Category B course has a 95% first-time pass rate!
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

export default CategoryB;
