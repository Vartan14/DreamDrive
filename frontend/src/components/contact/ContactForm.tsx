import React from 'react';
import { Button } from '@/components/ui/button';

const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Симуляція відправки форми
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Скидання форми через 3 секунди
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-secondary border border-gray-800 rounded-lg p-6 md:p-8 flex flex-col flex-grow h-full">
      {isSubmitted ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lider-red/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lider-red">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Дякуємо!</h3>
          <p className="text-gray-300">Ваше повідомлення надіслано. Ми зв'яжемося з вами найближчим часом.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Ваше ім'я <span className="text-lider-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lider-red/50 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Електронна пошта <span className="text-lider-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lider-red/50 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lider-red/50 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Тема <span className="text-lider-red">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lider-red/50 focus:border-transparent"
                  required
                >
                  <option value="">Оберіть тему</option>
                  <option value="Course Inquiry">Запит щодо курсу</option>
                  <option value="Pricing Question">Питання щодо ціни</option>
                  <option value="Schedule Lesson">Запис на заняття</option>
                  <option value="Feedback">Відгук</option>
                  <option value="Other">Інше</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Ваше повідомлення <span className="text-lider-red">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lider-red/50 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>
            
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Відправка...' : 'Відправити повідомлення'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;