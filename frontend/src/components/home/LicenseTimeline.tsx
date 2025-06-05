
import React from 'react';

const steps_eng = [
  {
    id: 1,
    title: 'Apply to Our School',
    description: 'Fill in the registration form and choose your preferred location and license category'
  },
  {
    id: 2,
    title: 'Complete Medical Check',
    description: "Undergo a standard medical examination to ensure you're fit to drive"
  },
  {
    id: 3,
    title: 'Start Theory Classes',
    description: 'Learn traffic rules, regulations, and safe driving principles in the classroom'
  },
  {
    id: 4,
    title: 'Practice Driving Skills',
    description: 'Get behind the wheel with an instructor to develop practical driving skills'
  },
  {
    id: 5,
    title: 'Pass Internal Exams',
    description: 'Complete our internal theoretical and practical examinations'
  },
  {
    id: 6,
    title: 'Take Official Exam',
    description: 'Successfully complete the official driving test to receive your license'
  }
];


const steps = [
  {
    id: 1,
    title: 'Подайте заявку до автошколи',
    description: 'Заповніть реєстраційну форму та оберіть бажану локацію й категорію посвідчення'
  },
  {
    id: 2,
    title: 'Пройдіть медичний огляд',
    description: 'Пройдіть стандартний медичний огляд, щоб підтвердити придатність до керування авто'
  },
  {
    id: 3,
    title: 'Розпочніть теоретичні заняття',
    description: 'Вивчайте правила дорожнього руху, норми та принципи безпечного водіння в класі'
  },
  {
    id: 4,
    title: 'Відпрацьовуйте навички водіння',
    description: 'Сідайте за кермо з інструктором для розвитку практичних навичок водіння'
  },
  {
    id: 5,
    title: 'Складіть внутрішні іспити',
    description: 'Пройдіть наші внутрішні теоретичний і практичний іспити'
  },
  {
    id: 6,
    title: 'Складіть офіційний іспит',
    description: 'Успішно складіть офіційний іспит з водіння та отримайте посвідчення водія'
  }
];


const LicenseTimeline = () => {
  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg">
            {/* How to Get Your License */}
            Як отримати водійське посвідчення
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {/* The path to getting your driver's license with DREAM is straightforward and supportive */}
            Шлях до отримання водійських прав з DREAM є простим та цікавим
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-lider-red/30"></div>

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`relative flex md:items-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-secondary p-6 rounded-xl border border-gray-700 hover:border-lider-red/50 transition-all duration-300 hover-scale">
                    <div className="flex items-center md:justify-end mb-4">
                      <span className="w-8 h-8 rounded-full bg-lider-red flex items-center justify-center text-white font-bold">
                        {step.id}
                      </span>
                      <h3 className={`text-xl font-bold ${index % 2 === 0 ? 'md:mr-4' : 'ml-4 md:ml-0 md:mr-4'}`}>{step.title}</h3>
                    </div>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot for desktop */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-lider-red"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LicenseTimeline;
