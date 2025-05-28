import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/pages/Auth/OLD_AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  ChevronDown,
  Calendar 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Мок-дані платежів
const mockPayments = [
  {
    id: 'PAY-001',
    student: 'John Student',
    email: 'john@example.com',
    amount: 299,
    date: '2023-06-10',
    status: 'completed',
    method: 'Кредитна картка',
    subscription: 'Категорія B — Повний курс'
  },
  {
    id: 'PAY-002',
    student: 'Maria Garcia',
    email: 'maria@example.com',
    amount: 299,
    date: '2023-06-08',
    status: 'completed',
    method: 'PayPal',
    subscription: 'Категорія B — Повний курс'
  },
  {
    id: 'PAY-003',
    student: 'David Wilson',
    email: 'david@example.com',
    amount: 199,
    date: '2023-06-08',
    status: 'completed',
    method: 'Банківський переказ',
    subscription: 'Категорія A — Базовий'
  },
  {
    id: 'PAY-004',
    student: 'Sarah Johnson',
    email: 'sarah@example.com',
    amount: 299,
    date: '2023-06-07',
    status: 'failed',
    method: 'Кредитна картка',
    subscription: 'Категорія B — Повний курс'
  },
  {
    id: 'PAY-005',
    student: 'Emily Turner',
    email: 'emily@example.com',
    amount: 450,
    date: '2023-06-06',
    status: 'pending',
    method: 'Кредитна картка',
    subscription: 'Категорія C — Професійний'
  },
  {
    id: 'PAY-006',
    student: 'Robert Chen',
    email: 'robert@example.com',
    amount: 199,
    date: '2023-06-05',
    status: 'completed',
    method: 'PayPal',
    subscription: 'Категорія A — Базовий'
  },
  {
    id: 'PAY-007',
    student: 'Anna Kim',
    email: 'anna@example.com',
    amount: 199,
    date: '2023-06-04',
    status: 'refunded',
    method: 'Кредитна картка',
    subscription: 'Категорія A — Базовий'
  },
];

const AdminPaymentOverview = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Перенаправлення якщо не адміністратор
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);
  
  // Фільтрація платежів за пошуком і статусом
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Підрахунок статистики
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingRevenue = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
  const failedPayments = mockPayments.filter(p => p.status === 'failed').length;

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  // Відображення статусу
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-600">Завершено</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">В очікуванні</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Помилка</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-600">Повернено</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Огляд платежів
            </h1>
            <p className="text-gray-400">
              Відстежуйте всі транзакції та платіжну активність
            </p>
          </CardContent>
        </Card>

        {/* Картки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Всього отримано</p>
                  <h3 className="text-3xl font-bold mt-1">${totalRevenue}</h3>
                </div>
                <CreditCard size={24} className="text-lider-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Очікувані надходження</p>
                  <h3 className="text-3xl font-bold mt-1">${pendingRevenue}</h3>
                </div>
                <Calendar size={24} className="text-lider-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Завершених оплат</p>
                  <h3 className="text-3xl font-bold mt-1">{completedPayments}</h3>
                </div>
                <CreditCard size={24} className="text-lider-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Помилкових оплат</p>
                  <h3 className="text-3xl font-bold mt-1">{failedPayments}</h3>
                </div>
                <CreditCard size={24} className="text-lider-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Фільтри та пошук */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Пошук за ім'ям, email або ID платежу..."
              className="pl-10 bg-secondary border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px] bg-secondary border-gray-700">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Фільтр за статусом" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі статуси</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
                <SelectItem value="pending">В очікуванні</SelectItem>
                <SelectItem value="failed">Помилка</SelectItem>
                <SelectItem value="refunded">Повернено</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex gap-2">
              <Download size={16} />
              Експортувати
            </Button>
          </div>
        </div>
        
        {/* Таблиця платежів */}
        <Card className="bg-secondary border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard size={18} className="mr-2 text-lider-red" />
              Транзакції платежів
            </CardTitle>
            <CardDescription>
              Повний список усіх платіжних транзакцій
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead>ID платежу</TableHead>
                  <TableHead>Студент</TableHead>
                  <TableHead>Сума</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Метод</TableHead>
                  <TableHead className="w-[100px]">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map(payment => (
                  <TableRow key={payment.id} className="border-gray-700">
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{payment.student}</div>
                        <div className="text-sm text-gray-400">{payment.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString('uk-UA')}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-lider-red hover:text-red-400"
                        onClick={() => navigate(`/admin/payments/${payment.id}`)}
                      >
                        Деталі
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">За вашим запитом не знайдено жодного платежу.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminPaymentOverview;
