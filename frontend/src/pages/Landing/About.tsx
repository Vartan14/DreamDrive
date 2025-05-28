
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Calendar, Users, Award, Car, Star, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Timeline data
// const timelineEvents = [
//   {
//     year: "2005",
//     title: "Foundation",
//     description: "LIDER Driving School was founded with just 2 instructors and 1 vehicle."
//   },
//   {
//     year: "2008",
//     title: "First Branch Expansion",
//     description: "Opened our second branch and expanded to 10 instructors and 5 vehicles."
//   },
//   {
//     year: "2012",
//     title: "Motorcycle Courses",
//     description: "Added Category A training with specialized motorcycle instructors."
//   },
//   {
//     year: "2015",
//     title: "City-wide Recognition",
//     description: "Awarded 'Best Driving School in Kyiv' for highest pass rates."
//   },
//   {
//     year: "2018",
//     title: "Nationwide Expansion",
//     description: "Expanded to 5 major cities across Ukraine with over 50 instructors."
//   },
//   {
//     year: "2021",
//     title: "Advanced Training Center",
//     description: "Opened state-of-the-art training facility with simulators and modern classrooms."
//   },
//   {
//     year: "2023",
//     title: "Digital Transformation",
//     description: "Launched our interactive learning platform and scheduling app for students."
//   }
// ];

// // Stats
// const stats = [
//   {
//     value: "35,000+",
//     label: "Successful Students",
//     icon: <Users size={28} className="text-lider-red" />
//   },
//   {
//     value: "95%",
//     label: "First-Time Pass Rate",
//     icon: <Award size={28} className="text-lider-red" />
//   },
//   {
//     value: "6",
//     label: "Branches Nationwide",
//     icon: <MapPin size={28} className="text-lider-red" />
//   },
//   {
//     value: "70+",
//     label: "Professional Instructors",
//     icon: <Star size={28} className="text-lider-red" />
//   }
// ];

// // Instructor profiles
// const instructors = [
//   {
//     name: "Oleksandr Petrenko",
//     title: "Chief Instructor, Category B",
//     experience: "15 years",
//     photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//     description: "Oleksandr leads our car training program with over 15 years of experience and a perfect safety record."
//   },
//   {
//     name: "Natalia Kovalenko",
//     title: "Senior Instructor, Category A",
//     experience: "10 years",
//     photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//     description: "Natalia specializes in motorcycle training and has helped over 1,000 students get their Category A license."
//   },
//   {
//     name: "Volodymyr Shevchenko",
//     title: "Senior Instructor, Category C",
//     experience: "12 years",
//     photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//     description: "Volodymyr is our truck driving expert with extensive knowledge of commercial vehicle regulations."
//   },
//   {
//     name: "Iryna Kovalchuk",
//     title: "Theory Instructor",
//     experience: "8 years",
//     photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
//     description: "Iryna makes learning traffic rules engaging and has developed our comprehensive theory curriculum."
//   }
// ];

// // Fleet items
// const fleetItems = [
//   {
//     type: "Cars",
//     description: "Modern compact vehicles ideal for beginners, equipped with dual controls for safety.",
//     models: "Toyota Yaris, Volkswagen Golf, Skoda Fabia",
//     image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
//   },
//   {
//     type: "Motorcycles",
//     description: "Range of motorcycles from light 125cc to full-power bikes for all license categories.",
//     models: "Honda CB125R, Yamaha MT-07, Kawasaki Z650",
//     image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
//   },
//   {
//     type: "Trucks",
//     description: "Commercial vehicles for Category C training with modern safety features.",
//     models: "Mercedes Atego, MAN TGX, DAF CF",
//     image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
//   }
// ];

// Хронологія подій
const timelineEvents = [
  {
    year: "2005",
    title: "Заснування",
    description: "Автошколу було засновано з двома інструкторами та одним автомобілем."
  },
  {
    year: "2008",
    title: "Перше розширення",
    description: "Відкрито друге відділення, кількість інструкторів зросла до 10, а автопарк — до 5 авто."
  },
  {
    year: "2012",
    title: "Курси для мотоциклістів",
    description: "Додано підготовку за категорією A з професійними інструкторами з мотоциклів."
  },
  {
    year: "2015",
    title: "Міське визнання",
    description: "Нагороджено як 'Найкраща автошкола Києва' за найвищий рівень складання іспитів з першого разу."
  },
  {
    year: "2018",
    title: "Всеукраїнське розширення",
    description: "Автошкола розширилася до 5 великих міст України з понад 50 інструкторами."
  },
  {
    year: "2021",
    title: "Центр розширеної підготовки",
    description: "Відкрито сучасний навчальний центр із симуляторами та обладнаними класами."
  },
  {
    year: "2023",
    title: "Цифрова трансформація",
    description: "Запущено інтерактивну платформу для навчання та застосунок для розкладу занять."
  }
];

// Статистика
const stats = [
  {
    value: "35 000+",
    label: "Успішних учнів",
    icon: <Users size={28} className="text-lider-red" />
  },
  {
    value: "95%",
    label: "Складають з першого разу",
    icon: <Award size={28} className="text-lider-red" />
  },
  {
    value: "6",
    label: "Філій по всій Україні",
    icon: <MapPin size={28} className="text-lider-red" />
  },
  {
    value: "70+",
    label: "Професійних інструкторів",
    icon: <Star size={28} className="text-lider-red" />
  }
];

// Профілі інструкторів
const instructors = [
  {
    name: "Олександр Петренко",
    title: "Головний інструктор, категорія B",
    experience: "15 років",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Олександр очолює програму навчання водіїв категорії B, має понад 15 років досвіду та бездоганну репутацію з безпеки."
  },
  {
    name: "Наталія Коваленко",
    title: "Старший інструктор, категорія A",
    experience: "10 років",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Наталія спеціалізується на підготовці мотоциклістів і допомогла понад 1000 учням отримати посвідчення категорії A."
  },
  {
    name: "Володимир Шевченко",
    title: "Старший інструктор, категорія C",
    experience: "12 років",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Володимир — експерт із водіння вантажівок, добре обізнаний із правилами комерційних перевезень."
  },
  {
    name: "Ірина Ковальчук",
    title: "Інструктор з теорії",
    experience: "8 років",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    description: "Ірина робить вивчення ПДР цікавим і розробила нашу повну програму теоретичного навчання."
  }
];

// Автопарк
const fleetItems = [
  {
    type: "Автомобілі",
    description: "Сучасні компактні авто, ідеальні для новачків, оснащені дубльованими педалями безпеки.",
    models: "Toyota Yaris, Volkswagen Golf, Skoda Fabia",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    type: "Мотоцикли",
    description: "Асортимент мотоциклів від легких 125 см³ до потужних байків для всіх категорій.",
    models: "Honda CB125R, Yamaha MT-07, Kawasaki Z650",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    type: "Вантажівки",
    description: "Комерційні авто для навчання категорії C з сучасними системами безпеки.",
    models: "Mercedes Atego, MAN TGX, DAF CF",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];


function MapPin({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

const About = () => {
  return (
    <PageLayout>
      <PageHeader 
        // title="About DREAM Driving School" 
        // subtitle="Leading the way in driver education since 2005"
        title='Про автошколу DREAM Drive'
        subtitle='Лідер у навчанні водіїв з 2005 року'
      />
      
      {/* Mission Statement */}
      <section className="container-custom mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="heading-md mb-6">Наша місія</h2>
            <p className="text-gray-300 mb-6">
              {/* At LIDER Driving School, our mission is to create safe, confident, and responsible drivers through comprehensive training and personalized instruction. We believe that quality driver education is not just about passing an exam—it's about developing lifelong skills that keep our students and others safe on the road. */}
              В автошколі DREAM Drive наша місія — створити безпечних, впевнених і відповідальних водіїв завдяки всебічному навчанні та персоналізованому підходу. Ми вважаємо, що якісне навчання водіїв — це не лише складання іспиту, а й розвиток навичок на все життя, які забезпечують безпеку наших учнів та інших учасників дорожнього руху.
            </p>
            <p className="text-gray-300">
              {/* Founded in 2005, we've grown from a small local school to a nationwide network of driving education centers, maintaining our commitment to excellence and personalized approach throughout our expansion. */}
              Заснована в 2005 році, ми виросли з невеликої місцевої школи до всеукраїнської мережі центрів навчання водіїв, зберігаючи нашу прихильність до досконалості та персоналізованого підходу протягом усього періоду розширення.
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <img 
              src="/images/CEO_Placeholder.png"
              // src="https://images.unsplash.com/photo-1551022372-0bdac482b9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="DREAM Drive School CEO" 
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-6 text-center hover:border-lider-red/30 border border-transparent transition-all duration-300">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline */}
      <section className="container-custom py-16">
        <h2 className="heading-md mb-12 text-center">Наш Шлях</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-800"></div>
          
          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div key={index} className={`relative flex items-start ${
                index % 2 === 0 
                  ? 'md:flex-row'
                  : 'md:flex-row-reverse'
              }`}>
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-lider-red z-10 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className={`ml-16 md:ml-0 ${
                  index % 2 === 0 
                    ? 'md:mr-[50%] md:pr-12 text-left' 
                    : 'md:ml-[50%] md:pl-12 text-left'
                } w-full md:w-1/2`}>
                  <div className="bg-secondary p-6 rounded-lg border border-gray-800 hover:border-lider-red/20 transition-all duration-300">
                    <div className="text-lider-red font-bold mb-2">{event.year}</div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-300">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instructors */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <h2 className="heading-md mb-12 text-center">Знайомтесь з нашою командою</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((instructor, index) => (
              <div key={index} className="bg-black/30 rounded-lg overflow-hidden border border-gray-800 hover:border-lider-red/30 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={instructor.photo} 
                    alt={instructor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1">{instructor.name}</h3>
                  <div className="text-lider-red font-medium text-sm mb-2">{instructor.title}</div>
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Calendar size={14} className="mr-1" />
                    {instructor.experience} experience
                  </div>
                  <p className="text-gray-300 text-sm">{instructor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Vehicle Fleet */}
      <section className="container-custom py-16">
        <h2 className="heading-md mb-12 text-center">Наші траспортні засоби</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleetItems.map((item, index) => (
            <div key={index} className="bg-secondary rounded-lg overflow-hidden border border-gray-800 hover:border-lider-red/30 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.type} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Car size={20} className="text-lider-red mr-2" />
                  {item.type}
                </h3>
                <p className="text-gray-300 mb-3">{item.description}</p>
                <div className="bg-black/40 p-3 rounded text-sm">
                  <strong className="text-lider-red">Models:</strong> {item.models}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Certifications */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <h2 className="heading-md mb-8 text-center">
            Сертифікації та Нагороди
            {/* Our Certifications & Affiliations */}
            </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800 flex items-start">
              <div className="rounded-full bg-lider-red/10 p-3 mr-4">
                <FileCheck size={20} className="text-lider-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                   {/* Licensed Training Provider */}
                   Акредитований навчальний заклад
                </h3>
                <p className="text-gray-300">
                  {/* Fully licensed by the Ministry of Transportation and Infrastructure to provide driver education for all license categories. */}
                  Повністю ліцензована Міністерством транспорту та інфраструктури для надання навчання водіїв для всіх категорій водійських прав.
                </p>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800 flex items-start">
              <div className="rounded-full bg-lider-red/10 p-3 mr-4">
                <Award size={20} className="text-lider-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {/* Certified Instructors */}
                  Сертифіковані інструктори
                  </h3>
                <p className="text-gray-300">
                  {/* All our instructors are certified professionals who undergo regular training and assessments to maintain the highest standards. */}
                  Всі наші інструктори — сертифіковані професіонали, які проходять регулярне навчання та оцінювання для підтримки найвищих стандартів.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      {/* <section className="container-custom py-16">
        <div className="bg-lider-red/10 border border-lider-red/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join LIDER Driving School?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Take the first step toward becoming a confident, skilled driver with Ukraine's leading driving school.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="btn-primary">
              View Our Courses
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section> */}
    </PageLayout>
  );
};

export default About;
