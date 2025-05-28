
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample review data
// const reviewsData = [
//   {
//     id: '1',
//     name: 'Olena Kovalenko',
//     date: 'March 15, 2023',
//     rating: 5,
//     text: 'I was very nervous about learning to drive, but my instructor Oleksandr was patient and supportive. Passed my test first time! Highly recommend LIDER for anyone who wants quality instruction.',
//     photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
//     licenseCategory: 'Category B'
//   },
//   {
//     id: '2',
//     name: 'Andriy Petrenko',
//     date: 'February 24, 2023',
//     rating: 5,
//     text: 'Excellent motorcycle training program! The instructors really focus on safety while making the lessons enjoyable. The practice area is perfect for learning all the maneuvers needed for the test.',
//     photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
//     licenseCategory: 'Category A'
//   },
//   {
//     id: '3',
//     name: 'Natalia Shevchenko',
//     date: 'April 5, 2023',
//     rating: 4,
//     text: 'I needed to get my truck license quickly for a new job opportunity. LIDER delivered with their intensive course. The theory classes were comprehensive and the practical training was very thorough.',
//     photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
//     licenseCategory: 'Category C'
//   },
//   {
//     id: '4',
//     name: 'Volodymyr Melnyk',
//     date: 'January 17, 2023',
//     rating: 5,
//     text: 'After failing my driving test twice with another school, I switched to LIDER and passed on my first attempt! The instructors here really know how to prepare you for the real test conditions.',
//     photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
//     licenseCategory: 'Category B'
//   },
//   {
//     id: '5',
//     name: 'Iryna Bondarenko',
//     date: 'May 12, 2023',
//     rating: 5,
//     text: 'The motorcycle course was excellent! I had never ridden before, and within a few weeks I felt confident enough to take my test. The instructors are knowledgeable and the bikes are well-maintained.',
//     licenseCategory: 'Category A'
//   },
//   {
//     id: '6',
//     name: 'Maksym Tkachenko',
//     date: 'March 3, 2023',
//     rating: 3,
//     text: 'The training was good, but I had to reschedule some lessons due to instructor unavailability. Overall the quality of teaching was high, but the administration could be more organized.',
//     licenseCategory: 'Category B'
//   },
//   {
//     id: '7',
//     name: 'Oksana Lysenko',
//     date: 'April 20, 2023',
//     rating: 5,
//     text: 'Learning to drive a truck was a big challenge for me, but the instructors at LIDER made it achievable. They break everything down into manageable steps and are very encouraging.',
//     photoUrl: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
//     licenseCategory: 'Category C'
//   },
//   {
//     id: '8',
//     name: 'Dmytro Kozlov',
//     date: 'February 7, 2023',
//     rating: 5,
//     text: "Best decision I made was choosing LIDER for my driver's education. The theory classes were engaging and the practical lessons were well-structured. Passed my test with confidence!",
//     licenseCategory: 'Category B'
//   },
// ];

// // Featured success stories
// const successStories = [
//   {
//     name: 'Maria Ivanova',
//     photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
//     quote: '"From complete beginner to confident driver in just 6 weeks! Thank you LIDER for the amazing instructors and supportive environment."',
//     achievement: 'Passed Category B first attempt'
//   },
//   {
//     name: 'Taras Kravchuk',
//     photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
//     quote: '"After struggling with motorcycle balance, LIDER\'s step-by-step approach helped me master the skills needed for my Category A license."',
//     achievement: 'Motorcycle enthusiast'
//   },
//   {
//     name: 'Yulia Ponomarenko',
//     photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
//     quote: '"The truck driving course was comprehensive and practical. I now have a great job as a professional driver thanks to LIDER."',
//     achievement: 'Commercial driver'
//   }
// ];

// Приклад відгуків
const reviewsData = [
  {
    id: '1',
    name: 'Олена Коваленко',
    date: '15 березня 2023',
    rating: 5,
    text: 'Я дуже хвилювалася щодо навчання водінню, але мій інструктор Олександр був терплячим і підтримуючим. Склала іспит з першого разу! Щиро рекомендую LIDER всім, хто хоче якісного навчання.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    licenseCategory: 'Категорія B'
  },
  {
    id: '2',
    name: 'Андрій Петренко',
    date: '24 лютого 2023',
    rating: 5,
    text: 'Чудова програма навчання мотоциклістів! Інструктори справді приділяють увагу безпеці та роблять заняття цікавими. Тренувальний майданчик ідеально підходить для відпрацювання всіх маневрів.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    licenseCategory: 'Категорія A'
  },
  {
    id: '3',
    name: 'Наталія Шевченко',
    date: '5 квітня 2023',
    rating: 4,
    text: 'Мені потрібно було швидко отримати водійські права на вантажівку для нової роботи. LIDER допомогли завдяки інтенсивному курсу. Теорія була всеохоплююча, а практичні заняття — дуже змістовні.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    licenseCategory: 'Категорія C'
  },
  {
    id: '4',
    name: 'Володимир Мельник',
    date: '17 січня 2023',
    rating: 5,
    text: 'Після двох невдалих спроб скласти іспит в іншій школі, я перейшов до LIDER і склав із першого разу! Інструктори тут дійсно знають, як підготувати до реальних умов іспиту.',
    photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    licenseCategory: 'Категорія B'
  },
  {
    id: '5',
    name: 'Ірина Бондаренко',
    date: '12 травня 2023',
    rating: 5,
    text: 'Курс для мотоциклістів був чудовим! Раніше я ніколи не їздила, але вже за кілька тижнів почувалася впевнено. Інструктори досвідчені, а мотоцикли в ідеальному стані.',
    licenseCategory: 'Категорія A'
  },
  {
    id: '6',
    name: 'Максим Ткаченко',
    date: '3 березня 2023',
    rating: 3,
    text: 'Навчання було хорошим, але довелося кілька разів переносити заняття через недоступність інструктора. Загалом рівень викладання високий, але адміністрація могла б бути організованішою.',
    licenseCategory: 'Категорія B'
  },
  {
    id: '7',
    name: 'Оксана Лисенко',
    date: '20 квітня 2023',
    rating: 5,
    text: 'Навчання водінню вантажівки стало справжнім викликом, але інструктори в LIDER допомогли мені впоратися. Вони подають матеріал поетапно й дуже підтримують.',
    photoUrl: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    licenseCategory: 'Категорія C'
  },
  {
    id: '8',
    name: 'Дмитро Козлов',
    date: '7 лютого 2023',
    rating: 5,
    text: 'Найкраще рішення — обрати LIDER для навчання. Заняття з теорії були захопливими, а практичні — добре структурованими. Склала іспит впевнено!',
    licenseCategory: 'Категорія B'
  },
];

// Історії успіху
const successStories = [
  {
    name: 'Марія Іванова',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    quote: '"Від повного новачка до впевненого водія всього за 6 тижнів! Дякую LIDER за чудових інструкторів та підтримку."',
    achievement: 'Склала категорію B з першого разу'
  },
  {
    name: 'Тарас Кравчук',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    quote: '"Після труднощів з утриманням рівноваги на мотоциклі, покроковий підхід LIDER допоміг мені опанувати всі навички для категорії A."',
    achievement: 'Любитель мотоциклів'
  },
  {
    name: 'Юлія Пономаренко',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    quote: '"Курс водіння вантажівки був комплексним і практичним. Тепер маю хорошу роботу професійного водія завдяки LIDER."',
    achievement: 'Комерційний водій'
  }
];


const Reviews = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredReviews = filter === 'all' 
    ? reviewsData 
    : reviewsData.filter(review => review.licenseCategory === filter);
  
  return (
    <PageLayout>
      <PageHeader 
        // title="Student Reviews" 
        // subtitle="See what our graduates say about their experience with LIDER Driving School"
        title='Відгуки cтудентів'
        subtitle='Досвід наших учнів з автошколою DREAM Drive'
      />
      
      {/* Overall Rating Stats */}
      <section className="container-custom mb-10">
        <div className="bg-secondary rounded-lg p-8 flex flex-col md:flex-row items-center justify-around border border-gray-800">
          <div className="text-center mb-6 md:mb-0">
            <div className="text-5xl font-bold mb-2">4.8</div>
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < 4 || i === 4 ? "text-lider-red fill-lider-red" : "text-gray-600"}
                />
              ))}
            </div>
            <div className="text-gray-400 text-sm">Середня оцінка</div>
          </div>
          
          <div className="text-center mb-6 md:mb-0">
            <div className="text-5xl font-bold mb-2">95<span className="text-2xl">%</span></div>
            <div className="text-gray-400 text-sm">Студентів отримують <br></br>посвідчення водія</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">35k<span className="text-2xl">+</span></div>
            <div className="text-gray-400 text-sm">Випущено студентів</div>
          </div>
        </div>
      </section>
      
      {/* Success Stories */}
      <section className="container-custom mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {/* Success Stories */}
          Історії успіху
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <div key={index} className="bg-secondary rounded-lg overflow-hidden border border-gray-800 hover:border-lider-red/30 transition-all duration-300">
              <div className="h-52 overflow-hidden">
                <img 
                  src={story.photo} 
                  alt={story.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">{story.name}</h3>
                  <div className="bg-lider-red/10 text-lider-red text-xs font-medium px-3 py-1 rounded-full">
                    {story.achievement}
                  </div>
                </div>
                <p className="text-gray-300 italic">{story.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Reviews */}
      <section className="bg-secondary py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">
              Інші відгуки
            </h2>
            
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400 mr-2">
                Фільтрувати:
              </span>
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-lider-red hover:bg-lider-red/90' : ''}
              >
                Усі
              </Button>
              <Button 
                variant={filter === 'Category A' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('Category A')}
                className={filter === 'Category A' ? 'bg-lider-red hover:bg-lider-red/90' : ''}
              >
                Категорія A
              </Button>
              <Button 
                variant={filter === 'Category B' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('Category B')}
                className={filter === 'Category B' ? 'bg-lider-red hover:bg-lider-red/90' : ''}
              >
                Категорія B
              </Button>
              <Button 
                variant={filter === 'Category C' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('Category C')}
                className={filter === 'Category C' ? 'bg-lider-red hover:bg-lider-red/90' : ''}
              >
                Категорія C
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">
                {/* No reviews found */}
                Відгуків не знайдено
              </h3>
              <p className="text-gray-400">
                {/* Try selecting a different category filter */}
                Спробуйте вибрати іншу категорію
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container-custom py-16">
        <div className="bg-black/50 rounded-lg border border-gray-800 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {/* Join Our Success Stories */}
            Приєднуйтесь до наших історій успіху
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            {/* Ready to start your driver&apos;s license journey with a driving school that has a proven track record of success? */}
            Готові розпочати свою подорож до отримання водійських прав в автошколі з перевіреною репутацією успіху?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="btn-primary">
              {/* View Our Courses */}
              Переглянути наші курси
            </Link>
            <Link to="/contact" className="btn-outline">
              Зв'язатися з нами
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Reviews;
