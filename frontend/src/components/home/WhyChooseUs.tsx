
import React from 'react';
import { Check } from 'lucide-react';

const features_eng = [
  {
    id: 1,
    title: 'Experienced Instructors',
    description: 'Learn from instructors with years of professional driving and teaching experience'
  },
  {
    id: 2,
    title: 'Modern Vehicle Fleet',
    description: 'Practice in well-maintained modern vehicles equipped with dual controls for safety'
  },
  {
    id: 3,
    title: 'Flexible Scheduling',
    description: 'Choose from morning, evening, or weekend classes to fit your busy lifestyle'
  },
  {
    id: 4,
    title: 'Personalized Approach',
    description: 'Get individualized attention and training tailored to your learning style'
  },
  {
    id: 5,
    title: 'High Pass Rate',
    description: 'Our students consistently achieve above-average success on their driving exams'
  },
  {
    id: 6,
    title: 'Multiple Locations',
    description: 'Conveniently located schools across Kyiv, Sloviansk, Kramatorsk, and Dnipro'
  },
  {
    id: 7,
    title: 'Comprehensive Courses',
    description: 'Complete theory and practical training for all license categories'
  }
];

const features = [
  {
    id: 1,
    title: 'Досвідчені інструктори',
    description: 'Навчайтесь у інструкторів із багаторічним досвідом водіння та викладання'
  },
  {
    id: 2,
    title: 'Сучасний автопарк',
    description: 'Практика на сучасних, добре доглянутих авто з подвійним управлінням для безпеки'
  },
  {
    id: 3,
    title: 'Гнучкий розклад',
    description: 'Обирайте заняття вранці, ввечері або у вихідні — відповідно до вашого графіку'
  },
  {
    id: 4,
    title: 'Індивідуальний підхід',
    description: 'Отримуйте персоналізоване навчання відповідно до вашого стилю засвоєння матеріалу'
  },
  {
    id: 5,
    title: 'Високий відсоток складання іспитів',
    description: 'Наші учні стабільно демонструють результати вищі за середні на іспитах з водіння'
  },
  {
    id: 6,
    title: 'Кілька локацій',
    description: 'Зручно розташовані автошколи в Києві, Слов’янську, Краматорську та Дніпрі'
  }
];



const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg">Чому варто обрати нас</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            У автошколі DREAM Drive ми пишаємося тим, що надаємо комплексну підготовку для водіїв
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="card-feature flex flex-col hover-scale">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-lider-red/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="text-lider-red" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
