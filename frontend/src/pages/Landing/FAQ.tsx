import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// FAQ дані, організовані за категоріями
const faqData = {
  general: [
    {
      question: "Як записатися на уроки водіння?",
      answer: "Ви можете записатися на уроки водіння, відвідавши будь-яку з наших філій, зателефонувавши на нашу гарячу лінію або заповнивши форму на сторінці Контакти. Наш співробітник зв'яжеться з вами протягом 24 годин для узгодження першого заняття."
    },
    {
      question: "Які документи потрібні для початку навчання?",
      answer: "Вам знадобиться дійсний паспорт або ID-картка та медична довідка про придатність до керування транспортним засобом. Для деяких категорій можуть знадобитися додаткові документи. Наші співробітники нададуть детальну інформацію залежно від обраної категорії."
    },
    {
      question: "Скільки часу займає отримання водійського посвідчення?",
      answer: "Тривалість навчання залежить від категорії посвідчення та ваших індивідуальних успіхів. В середньому, категорія B (легковий автомобіль) — 6-8 тижнів, категорія A (мотоцикл) — 4-6 тижнів, категорія C (вантажівка) — 8-10 тижнів."
    },
    {
      question: "Що робити, якщо я не склав іспит?",
      answer: "Якщо ви не склали іспит, ви можете перескласти його через 1 тиждень. Деякі наші пакети включають одну безкоштовну пересдачу, для інших потрібно сплатити додаткову плату за повторне складання. Також ми пропонуємо додаткові заняття для кращої підготовки до наступної спроби."
    },
    {
      question: "Чи надаєте ви транспорт для занять та іспитів?",
      answer: "Так, ми надаємо всі необхідні транспортні засоби для занять та іспитів. Наш автопарк включає легкові автомобілі, мотоцикли та вантажівки, які регулярно проходять технічне обслуговування та відповідають усім стандартам безпеки."
    }
  ],
  courses: [
    {
      question: "Що входить до курсу водіння?",
      answer: "Наші стандартні курси водіння включають як теоретичні, так і практичні заняття. Теорія охоплює правила дорожнього руху, дорожні знаки та вимоги безпеки. Практичні заняття проводяться з сертифікованим інструктором — від основ керування авто до складних маневрів."
    },
    {
      question: "Чи можу я обрати інструктора?",
      answer: "Так, ви можете обрати конкретного інструктора за умови його доступності. Якщо вам не підходить призначений інструктор, ви можете змінити його у будь-який час."
    },
    {
      question: "Скільки триває одне заняття з водіння?",
      answer: "Одне практичне заняття зазвичай триває 45-60 хвилин залежно від обраного пакету. Теоретичні заняття тривають 1,5-2 години."
    },
    {
      question: "Чи є у вас інтенсивні курси?",
      answer: "Так, ми пропонуємо інтенсивні курси для тих, хто хоче отримати посвідчення швидше. Такі курси стискають стандартну програму у коротший термін з більш частими заняттями. Для деталей звертайтесь до нас."
    },
    {
      question: "Якими мовами проводяться курси?",
      answer: "Наші курси переважно проводяться українською та російською мовами. У деяких філіях можливе навчання англійською. Уточнюйте у вашій філії."
    }
  ],
  payment: [
    {
      question: "Які способи оплати ви приймаєте?",
      answer: "Ми приймаємо готівку, банківські картки, перекази та деякі мобільні додатки. Оплату можна здійснити повністю або частинами для окремих пакетів."
    },
    {
      question: "Чи можна платити частинами?",
      answer: "Так, для більшості курсів доступна оплата частинами. Зазвичай, ви можете розділити оплату на 2-3 платежі протягом навчання. Для деталей звертайтесь до служби підтримки."
    },
    {
      question: "Чи є приховані платежі?",
      answer: "Ні, всі ціни прозорі та включають необхідні матеріали та використання транспорту. Додаткові витрати можливі лише за перескладання іспиту (якщо це не входить у ваш пакет) або додаткові практичні заняття."
    },
    {
      question: "Чи є знижки для студентів?",
      answer: "Так, ми надаємо знижки для студентів денної форми навчання за наявності студентського квитка. Також періодично діють акції та групові знижки. Слідкуйте за новинами на сайті або звертайтесь до нас."
    },
    {
      question: "Яка у вас політика повернення коштів?",
      answer: "Якщо ви скасовуєте курс до початку занять, ми повертаємо кошти за вирахуванням адміністративного збору. Часткове повернення можливе за невикористані заняття згідно з нашими умовами. Для деталей звертайтесь до служби підтримки."
    }
  ],
  exams: [
    {
      question: "Як проходить іспит з водіння?",
      answer: "Іспит складається з двох частин: теоретичної та практичної. Теорія — це комп'ютерний тест з вибором відповідей. Практика — демонстрація навичок водіння у реальних дорожніх умовах з екзаменатором."
    },
    {
      question: "Скільки питань у теоретичному тесті?",
      answer: "Теоретичний тест містить 20 питань з вибором відповіді. Для успішного складання потрібно правильно відповісти на щонайменше 16. Питання охоплюють ПДР, знаки, безпеку та особливості вашої категорії."
    },
    {
      question: "Чи можна потренуватися перед теоретичним іспитом?",
      answer: "Так, ми надаємо тренувальні тести під час теоретичних занять. Також ви можете проходити онлайн-тести у нашому студентському кабінеті у зручний для вас час."
    },
    {
      question: "Що відбувається на практичному іспиті?",
      answer: "Під час практичного іспиту ви виконуєте маневри (паралельне паркування, розворот у три прийоми, екстрене гальмування тощо) та їздите різними дорогами, щоб показати свої навички у різних умовах."
    },
    {
      question: "Який термін очікування між невдалими спробами?",
      answer: "Якщо ви не склали теорію чи практику, повторна спроба можлива не раніше ніж через 7 днів. Це дає час на додаткову підготовку."
    }
  ]
};

const FAQ = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Поширені запитання" 
        subtitle="Знайдіть відповіді на найпоширеніші питання щодо наших курсів водіння"
      />
      
      <section className="container-custom mb-20">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-secondary border border-gray-800">
              <TabsTrigger value="general">Загальні</TabsTrigger>
              <TabsTrigger value="courses">Курси</TabsTrigger>
              <TabsTrigger value="payment">Оплата</TabsTrigger>
              <TabsTrigger value="exams">Іспити</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="general" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.general.map((item, index) => (
                <AccordionItem key={index} value={`general-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left font-medium py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.courses.map((item, index) => (
                <AccordionItem key={index} value={`courses-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left font-medium py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.payment.map((item, index) => (
                <AccordionItem key={index} value={`payment-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left font-medium py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="exams" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.exams.map((item, index) => (
                <AccordionItem key={index} value={`exams-${index}`} className="border-gray-800">
                  <AccordionTrigger className="text-left font-medium py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Блок "Не знайшли відповідь?" */}
      <section className="bg-secondary py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Залишились питання?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Якщо ви не знайшли потрібної відповіді — наша служба підтримки завжди готова допомогти!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Зв'язатися з нами
            </Link>
            <a href="tel:+380123456789" className="btn-outline">
              Подзвонити
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQ;