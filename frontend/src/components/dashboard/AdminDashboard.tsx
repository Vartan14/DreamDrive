import React from 'react';
import { Link } from 'react-router-dom';
import { AdminProfile } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, CreditCard, Calendar, Settings, MessageSquare, TrendingUp, BookOpen, FileText } from 'lucide-react';

interface AdminDashboardProps {
  user: AdminProfile;
}

// Мок-дані для адмін-дашборду
const statistics = {
  totalStudents: 145,
  totalInstructors: 12,
  totalBranches: 3,
  activeSubscriptions: 98,
  revenueThisMonth: 12450,
  lessonCompletionRate: 92,
  overallRating: 4.8
};

const recentPayments = [
  { id: 1, student: 'John Student', amount: 299, date: '2023-06-09', status: 'completed' },
  { id: 2, student: 'Maria Garcia', amount: 299, date: '2023-06-08', status: 'completed' },
  // { id: 3, student: 'David Wilson', amount: 199, date: '2023-06-08', status: 'completed' },
  // { id: 4, student: 'Sarah Johnson', amount: 299, date: '2023-06-07', status: 'failed' },
];

const newReviews = [
  { id: 1, student: 'Emily Johnson', rating: 5, date: '2023-06-09' },
  { id: 2, student: 'Michael Smith', rating: 4, date: '2023-06-08' },
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
                <p className="text-xs text-green-500 mt-1">+5.2% за місяць</p>
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
                <p className="text-xs text-green-500 mt-1">+3.7% за місяць</p>
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
                <h3 className="text-3xl font-bold mt-1">${statistics.revenueThisMonth}</h3>
                <p className="text-xs text-green-500 mt-1">+8.3% за місяць</p>
              </div>
              <TrendingUp size={24} className="text-lider-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Users & Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users */}
        <Card className="bg-gradient-to-br from-lider-red/20 to-black border-lider-red/30">
          <CardContent className="pt-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <Users size={36} className="mx-auto mb-4 text-lider-red" />
              <h3 className="font-bold text-lg mb-2">Керування користувачами</h3>
              <p className="text-gray-400 mb-4">
                Керуйте студентами та інструкторами, призначайте ролі та права.
              </p>
              <Button asChild className="bg-lider-red hover:bg-red-700">
                <Link to="/admin/users">Користувачі</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Payments */}
        <Card className="bg-secondary border-gray-800">
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
                    <div className="font-medium">${payment.amount}</div>
                    <div className={`text-xs ${
                      payment.status === 'completed' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {payment.status === 'completed' ? 'Завершено' : 'Помилка'}
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
        <Card className="bg-secondary border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar size={18} className="mr-2 text-lider-red" />
              Огляд розкладу
            </CardTitle>
            <CardDescription>
              Відстежуйте всі заплановані заняття по філіях та інструкторах
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Calendar size={36} className="mx-auto mb-2 text-lider-red opacity-80" />
              <Button asChild className="bg-lider-red hover:bg-red-700 mt-2">
                <Link to="/admin/schedule">Переглянути розклад</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Materials */}
        <Card className="bg-secondary border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen size={18} className="mr-2 text-lider-red" />
              Матеріали
            </CardTitle>
            <CardDescription>
              Керуйте навчальними матеріалами, ПДР та ресурсами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <BookOpen size={36} className="mx-auto mb-2 text-lider-red opacity-80" />
              <Button asChild className="bg-lider-red hover:bg-red-700 mt-2">
                <Link to="/materials">Керувати матеріалами</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Tests */}
        <Card className="bg-secondary border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={18} className="mr-2 text-lider-red" />
              Керування тестами
            </CardTitle>
            <CardDescription>
              Створюйте, редагуйте та переглядайте тести для учнів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <FileText size={36} className="mx-auto mb-2 text-lider-red opacity-80" />
              <Button asChild className="bg-lider-red hover:bg-red-700 mt-2">
                <Link to="/admin/tests">Керувати тестами</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Branches & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branches */}
        <Card className="bg-gradient-to-br from-gray-800/30 to-black border-gray-700 md:col-span-1">
          <CardContent className="pt-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <Building size={36} className="mx-auto mb-4 text-lider-red" />
              <h3 className="font-bold text-lg mb-2">Керування філіями</h3>
              <p className="text-gray-400 mb-4">
                Оновлюйте інформацію про філії, графік роботи та послуги.
              </p>
              <Button asChild className="bg-lider-red hover:bg-red-700">
                <Link to="/admin/branches">Філії</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
                <Button asChild variant="outline">
                  <Link to="/admin/reviews">Всі відгуки</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/reviews/moderate">Модерувати</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
