import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ContactForm from '@/components/contact/ContactForm';
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Contact = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Зв'яжіться з нами" 
        subtitle="Зв'яжіться з нашою командою з будь-яких питань або щоб записатися на перше заняття"
      />
      
      <section className="container-custom mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch min-h-[500px]">
          {/* Contact Form */}
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Залишити заявку</h2>
            <div className="flex-grow flex flex-col">
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">Контактна інформація</h2>
            <div className="bg-secondary border border-gray-800 rounded-lg p-6 md:p-8 flex-grow flex flex-col">
              <div className="space-y-6 flex-grow">
                <div className="flex items-start">
                  <MapPin size={22} className="text-lider-red mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Головний офіс</h3>
                    <p className="text-gray-300">вул. Головна, 123, Київ, Україна</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={22} className="text-lider-red mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Телефони</h3>
                    <p className="text-gray-300 mb-1">
                      <a href="tel:+380123456789" className="hover:text-lider-red transition-colors">
                        +380 12 345 6789
                      </a> (Головний)
                    </p>
                    <p className="text-gray-300">
                      <a href="tel:+380987654321" className="hover:text-lider-red transition-colors">
                        +380 98 765 4321
                      </a> (Підтримка)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={22} className="text-lider-red mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Електронна пошта</h3>
                    <p className="text-gray-300 mb-1">
                      <a href="mailto:info@liderdriving.com" className="hover:text-lider-red transition-colors">
                        info@liderdriving.com
                      </a> (Загальні питання)
                    </p>
                    <p className="text-gray-300">
                      <a href="mailto:support@liderdriving.com" className="hover:text-lider-red transition-colors">
                        support@liderdriving.com
                      </a> (Підтримка клієнтів)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={22} className="text-lider-red mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Графік роботи</h3>
                    <p className="text-gray-300 mb-1">Понеділок - П'ятниця: 9:00 - 18:00</p>
                    <p className="text-gray-300">Субота: 10:00 - 15:00</p>
                    <p className="text-gray-300">Неділя: вихідний</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            {/* <div className="bg-secondary border border-gray-800 rounded-lg p-6 md:p-8">
              <h3 className="font-bold mb-4">Ми в соцмережах</h3>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/50 hover:bg-black w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:text-lider-red"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/50 hover:bg-black w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:text-lider-red"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/50 hover:bg-black w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:text-lider-red"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      
      {/* FAQ Callout */}
      <section className="bg-secondary py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Є питання перед зверненням?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Перегляньте сторінку поширених запитань, щоб швидко знайти відповіді на найпопулярніші питання.
          </p>
          <a href="/faq" className="btn-outline">
            Перейти до FAQ
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
