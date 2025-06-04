import React from 'react';
import { Link } from 'react-router-dom';
import { UserData } from '@/types/userInterface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, CreditCard, Calendar, Settings, MessageSquare, TrendingUp, BookOpen, FileText, Medal } from 'lucide-react';

interface AdminDashboardProps {
  user: UserData;
}

// Мок-дані для адмін-дашборду
const statistics = {
  totalStudents: 14,
  totalInstructors: 2,
  totalBranches: 3,
  activeSubscriptions: 13,
  revenueThisMonth: 325000,
  lessonCompletionRate: 92,
  overallRating: 4.8
};

const recentPayments = [
  { id: 1, student: 'Тимур Захарченко', amount: 25000, date: '2023-06-09', status: 'success' },
  { id: 2, student: 'Олександра  Петренко', amount: 25000, date: '2023-06-08', status: 'success' },
  // { id: 3, student: 'David Wilson', amount: 199, date: '2023-06-08', status: 'completed' },
  // { id: 4, student: 'Sarah Johnson', amount: 299, date: '2023-06-07', status: 'failed' },
];

const newReviews = [
  { id: 1, student: 'Анна  Кравчук', rating: 5, date: '2023-06-09' },
  { id: 2, student: 'Артем Лисенко', rating: 4, date: '2023-06-08' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Огляд статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-secondary border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Всього студентів</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.totalStudents}</h3>
                <p className="text-xs text-green-500 mt-1">+13 за місяць</p>
              </div>
              <Users size={24} className="text-lider-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Всього інструкторів</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.totalInstructors}</h3>
                <p className="text-xs text-green-500 mt-1">+1 за місяць</p>
              </div>
              <Users size={24} className="text-lider-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Активних підписок</p>
                <h3 className="text-3xl font-bold mt-1">{statistics.activeSubscriptions}</h3>
                <p className="text-xs text-green-500 mt-1">+13 за місяць</p>
              </div>
              <CreditCard size={24} className="text-lider-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Дохід за місяць</p>
                <h3 className="text-3xl font-bold mt-1">
                  {statistics.revenueThisMonth.toLocaleString('uk-UA')} грн
                </h3>
                <p className="text-xs text-green-500 mt-1">+100% за місяць</p>
              </div>
              <TrendingUp size={24} className="text-lider-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Users & Payments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <Card className="bg-secondary border-gray-800 md:col-span-1">
          <CardContent className="pt-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <Users size={36} className="mx-auto mb-4 text-lider-red" />
              <h3 className="font-bold text-lg mb-2">Керування користувачами</h3>
              <p className="text-gray-400 mb-4">
                Керуйте студентами та інструкторами
              </p>
              <Button asChild className="bg-lider-red hover:bg-red-700">
                <Link to="/admin/users">Користувачі</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Payments */}
        <Card className="bg-secondary border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard size={18} className="mr-2 text-lider-red" />
              Останні платежі
            </CardTitle>
            <CardDescription>
              Відстежуйте останні платіжні транзакції
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map(payment => (
                <div 
                  key={payment.id} 
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                >
                  <div>
                    <div className="font-medium">{payment.student}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(payment.date).toLocaleDateString('uk-UA')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{payment.amount.toLocaleString('uk-UA')} грн</div>
                    <div className={`text-xs ${
                      payment.status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {payment.status === 'success' ? 'Завершено' : 'Помилка'}
                    </div>
                  </div>
                </div>
              ))}
              <Button asChild className="w-full bg-lider-red hover:bg-red-700">
                <Link to="/admin/payments">Всі платежі</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Schedule, Materials, Tests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schedule */}
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <Calendar size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Розклад</h3>
            <p className="text-gray-400 mb-4 text-center">
             Управляйте розкладом занять викладачів 
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/admin/schedule">Перейти до розкладу</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Materials */}
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <BookOpen size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Матеріали</h3>
            <p className="text-gray-400 mb-4 text-center">
              Керуйте навчальними матеріалами та ресурсами для студентів
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/admin/materials">Перейти до матеріалів</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Tests */}
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <Medal size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Тести</h3>
            <p className="text-gray-400 mb-4 text-center">
              Керуйте тестами та переглядайте результати студентів
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/admin/tests">Управління тестами</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Branches & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
        {/* Reviews (wider) */}
        <Card className="bg-secondary border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare size={18} className="mr-2 text-lider-red" />
              Нові відгуки
            </CardTitle>
            <CardDescription>
              Останні відгуки та фідбек студентів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newReviews.map(review => (
                <div 
                  key={review.id} 
                  className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{review.student}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString('uk-UA')}
                  </div>
                </div>
              ))}
              {newReviews.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  Немає нових відгуків
                </div>
              )}
              <div className="flex justify-between">
                <Button asChild variant="outline" className="bg-lider-red hover:bg-red-700">
                  <Link to="/admin/reviews">Перейти до відгуків</Link>
                </Button>
              
              </div>
            </div>
          </CardContent>
        </Card>
          {/* Branches */}
        <Card className="bg-secondary border-gray-700 md:col-span-1">
          <CardContent className="pt-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <Building size={36} className="mx-auto mb-4 text-lider-red" />
              <h3 className="font-bold text-lg mb-2">Керування філіями</h3>
              <p className="text-gray-400 mb-4">
                Оновлюйте інформацію про філії, графік роботи та послуги.
              </p>
              <Button asChild className="bg-lider-red hover:bg-red-700">
                <Link to="/admin/branches">Керування філіями</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
