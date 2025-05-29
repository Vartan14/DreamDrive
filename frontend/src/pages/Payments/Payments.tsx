import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Calendar, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const pricingOptions = [
  {
    title: "Категорії A та A1",
    price: "15 000 UAH",
    description: "Ідеально для любителів мотоциклів",
    features: [
      { text: "20 годин теорії", included: true },
      { text: "15 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: true },
      { text: "Мотоцикл надається", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: false },
    ],
    popular: false,
    ctaLink: "/dashboard",
  },
  {
    title: "Категорія B",
    price: "25 000 UAH",
    description: "Найпопулярніша категорія водійських прав",
    features: [
      { text: "30 годин теорії", included: true },
      { text: "25 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: true },
      { text: "Авто надається на іспит", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: true },
    ],
    popular: true,
    ctaLink: "/dashboard",
  },
  {
    title: "Категорії C та CE",
    price: "17 500 UAH",
    description: "Кваліфікація професійного водія вантажівки",
    features: [
      { text: "40 годин теорії", included: true },
      { text: "30 практичних занять", included: true },
      { text: "Імітації іспитів", included: true },
      { text: "Заняття у вихідні доступні", included: false },
      { text: "Вантажівка надається для навчання", included: true },
      { text: "Особистий інструктор", included: true },
      { text: "Безкоштовна перескладання іспиту", included: true },
    ],
    popular: false,
    ctaLink: "/dashboard",
  }
];


// Mock payment history
const paymentHistory = [
  {
    id: 'pay_12345',
    date: '2023-05-15',
    amount: 79.99,
    description: 'Premium Plan - Monthly Subscription',
    status: 'completed'
  },
  {
    id: 'pay_12344',
    date: '2023-04-15',
    amount: 79.99,
    description: 'Premium Plan - Monthly Subscription',
    status: 'completed'
  },
  {
    id: 'pay_12343',
    date: '2023-03-15',
    amount: 79.99,
    description: 'Premium Plan - Monthly Subscription',
    status: 'completed'
  }
];

const Payments = () => {
  const navigate = useNavigate();
  const { user, isLoading, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'history'>('plans');
  const isSubscribed = user?.role === 'student' && user.is_paid;

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoading, user, navigate]);
  const handleSubscribe = (planId: string) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (user?.role === 'student') {
        // Update user subscription status
        updateUser({
          is_paid: true
        });
        
        toast({
          title: 'Subscription Successful',
          description: 'You now have full access to all learning materials and features.',
        });
        
        navigate('/dashboard');
      }
    }, 1500);
  };

  // Додаємо функцію для переходу на форму оплати з параметрами
  const handleSelectPlan = (plan: { title: string; price: string }) => {
    // Передаємо дані через state (можна через query params, якщо потрібно)
    navigate('/payments/pay', {
      state: {
        amount: Number(plan.price.replace(/\D/g, "")), // Витягуємо число з ціни
        description: plan.title,
      },
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Оплата та підписка" 
        subtitle="Оберіть тариф або керуйте своєю підпискою"
      />
      
      <div className="container-custom py-12">
        {/* Subscription Status for current users */}
        {user?.role === 'student' && (
          <Card className="bg-secondary border-gray-800 mb-10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-bold mb-2">Статус вашої підписки</h2>
                  <div className="flex items-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isSubscribed ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    } mr-3`}>
                      {isSubscribed ? 'Активна' : 'Неактивна'}
                    </span>
                    {isSubscribed && (
                      <span className="text-gray-400 text-sm">
                        Premium-план • Автоматичне поновлення 15 червня 2023
                      </span>
                    )}
                  </div>
                </div>
                {isSubscribed && (
                  <div className="mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="border-lider-red text-lider-red hover:bg-lider-red/10">
                      Керувати підпискою
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'plans' ? 'border-b-2 border-lider-red text-white' : 'text-gray-400'
            }`}
          >
            Тарифи
          </button>
          {user?.role === 'student' && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'history' ? 'border-b-2 border-lider-red text-white' : 'text-gray-400'
              }`}
            >
              Історія оплат
            </button>
          )}
        </div>
        
        {/* Subscription Plans */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingOptions.map((plan, idx) => (
              <Card 
                key={plan.title}
                className={`bg-secondary border-gray-800 ${
                  plan.popular ? 'border-lider-red ring-1 ring-lider-red' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-lider-red py-1 px-3 text-center text-sm font-medium">
                    Найпопулярніший
                  </div>
                )}
                <CardHeader className={plan.popular ? '' : 'pt-6'}>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                    </div>
                    <div className="text-gray-400 text-sm">{plan.description}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={18} className={feature.included ? "text-green-500 mr-2 flex-shrink-0 mt-0.5" : "text-gray-500 mr-2 flex-shrink-0 mt-0.5"} />
                        <span className={feature.included ? "" : "line-through text-gray-500"}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-lider-red hover:bg-red-700' : ''}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Обрати
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Payment History */}
        {activeTab === 'history' && (
          <Card className="bg-secondary border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={18} className="mr-2 text-lider-red" />
                Історія оплат
              </CardTitle>
              <CardDescription>
                Ваші останні транзакції
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.map(payment => (
                    <div 
                      key={payment.id}
                      className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <div className="font-medium">{payment.description}</div>
                          <div className="text-sm text-gray-400">
                            <Calendar size={14} className="inline mr-1" />
                            {new Date(payment.date).toLocaleDateString('uk-UA')}
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 text-right">
                          <div className="font-medium">${payment.amount.toFixed(2)}</div>
                          <div className={`text-xs ${
                            payment.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                          }`}>
                            {payment.status === 'completed' ? 'Завершено' : 'В очікуванні'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <CreditCard size={32} className="mx-auto mb-3 opacity-50" />
                  <p>Історія оплат відсутня</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Payments;
