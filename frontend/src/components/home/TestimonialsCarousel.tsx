
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials_eng = [
  {
    id: 1,
    name: 'Olena Kovalenko',
    text: 'The instructors at LIDER were extremely patient and knowledgeable. I passed my driving test on the first attempt thanks to their guidance.',
    location: 'Kyiv'
  },
  {
    id: 2,
    name: 'Maksym Petrov',
    text: 'I was nervous about learning to drive, but the team at LIDER made me feel comfortable from day one. Their step-by-step approach really worked for me.',
    location: 'Sloviansk'
  },
  {
    id: 3,
    name: 'Natalia Ivanova',
    text: 'The flexible scheduling was perfect for my busy work life. I could take lessons in the evenings and on weekends without any issues.',
    location: 'Dnipro'
  },
  {
    id: 4,
    name: 'Viktor Sidorenko',
    text: 'Learning to drive a truck seemed daunting, but the Category C course at LIDER broke everything down into manageable steps. Highly recommend!',
    location: 'Kramatorsk'
  },
  {
    id: 5,
    name: 'Sofia Lysenko',
    text: 'The modern vehicles and practice areas made learning so much easier. I felt well-prepared for real-world driving by the time I took my test.',
    location: 'Kyiv'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Олена Коваленко',
    text: 'Інструктори в DREAM були надзвичайно терплячими та обізнаними. Я склала іспит з першої спроби завдяки їхнім порадам.',
    location: 'Київ'
  },
  {
    id: 2,
    name: 'Максим Петров',
    text: 'Я дуже нервував перед навчанням водінню, але команда DREAM одразу створила комфортну атмосферу. Їхній покроковий підхід мені дуже допоміг.',
    location: 'Слов’янськ'
  },
  {
    id: 3,
    name: 'Наталія Іванова',
    text: 'Гнучкий розклад ідеально підійшов до мого напруженого робочого графіку. Я могла займатись у вечірній час і на вихідних без жодних проблем.',
    location: 'Дніпро'
  },
  {
    id: 4,
    name: 'Віктор Сидоренко',
    text: 'Навчання керуванню вантажівкою здавалося складним, але курс категорії C у DREAM розбив усе на зрозумілі кроки. Дуже рекомендую!',
    location: 'Краматорськ'
  },
  {
    id: 5,
    name: 'Софія Лисенко',
    text: 'Сучасні автомобілі та навчальні майданчики значно полегшили навчання. До моменту складання іспиту я почувалася повністю підготовленою до реального водіння.',
    location: 'Київ'
  }
];


const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling]);
  
  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);
  
  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  // Visual items to display (current and adjacent)
  const displayItems = () => {
    const items = [];
    const total = testimonials.length;
    
    // Calculate previous, current, and next indices
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    
    items.push({ index: prevIndex, className: "scale-90 opacity-60 hidden md:block" });
    items.push({ index: currentIndex, className: "scale-100 opacity-100 z-10" });
    items.push({ index: nextIndex, className: "scale-90 opacity-60 hidden md:block" });
    
    return items;
  };

  return (
    <section className="section-padding bg-secondary relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg">
            {/* What Our Students Say */}
            Що кажуть наші студенти
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">   
            {/* Hear from people who have successfully completed our driving courses */}
            Почуйте відгуки людей, які успішно пройшли наші курси водіння
          </p>
        </div>
        
        {/* Carousel Container */}
        <div 
          className="relative py-8"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Quote decoration */}
          <div className="absolute text-lider-red/10 text-[150px] font-serif leading-none top-0 left-1/2 -translate-x-1/2">
            "
          </div>
          
          {/* Testimonial Cards */}
          <div className="flex justify-center items-center gap-6 h-64 relative">
            {displayItems().map(({index, className}) => (
              <Card 
                key={testimonials[index].id}
                className={`absolute transition-all duration-500 w-full max-w-xl bg-black border border-gray-700 ${className}`}
                style={{
                  transform: `translateX(${(index - currentIndex) * 110}%)`
                }}
              >
                <CardContent className="p-6 text-center">
                  <p className="mb-6 text-gray-300 italic">"{testimonials[index].text}"</p>
                  <div>
                    <p className="font-bold text-lg">{testimonials[index].name}</p>
                    <p className="text-lider-red">{testimonials[index].location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-lider-red w-6' : 'bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
