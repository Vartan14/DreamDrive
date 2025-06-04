import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import AddUserForm from '@/components/admin/AddUserForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

// Мок-дані студентів
const MOCK_STUDENTS = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '+1 (555) 123-4567', status: 'Активний', progress: '75%' },
  { id: 2, name: 'Anna Johnson', email: 'anna.johnson@example.com', phone: '+1 (555) 234-5678', status: 'Активний', progress: '45%' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+1 (555) 345-6789', status: 'Неактивний', progress: '0%' },
  { id: 4, name: 'Emma Williams', email: 'emma.williams@example.com', phone: '+1 (555) 456-7890', status: 'Активний', progress: '90%' },
  { id: 5, name: 'James Wilson', email: 'james.wilson@example.com', phone: '+1 (555) 567-8901', status: 'Активний', progress: '30%' },
  { id: 6, name: 'Sarah Taylor', email: 'sarah.taylor@example.com', phone: '+1 (555) 678-9012', status: 'Очікує', progress: '0%' },
  { id: 7, name: 'David Evans', email: 'david.evans@example.com', phone: '+1 (555) 789-0123', status: 'Активний', progress: '60%' },
  { id: 8, name: 'Jessica Roberts', email: 'jessica.roberts@example.com', phone: '+1 (555) 890-1234', status: 'Активний', progress: '15%' }
];

const MOCK_INSTRUCTORS = [
  { id: 1, name: 'Olena Kovalenko', email: 'olena.k@example.com', phone: '+1 (555) 234-5678', specialization: 'Теорія', status: 'Активний' },
  { id: 2, name: 'Ivan Melnyk', email: 'ivan.m@example.com', phone: '+1 (555) 345-6789', specialization: 'Практика', status: 'Активний' },
  { id: 3, name: 'Sergiy Tkachenko', email: 'sergiy.t@example.com', phone: '+1 (555) 456-7890', specialization: 'Обидва', status: 'Активний' },
  { id: 4, name: 'Maria Rodriguez', email: 'maria.r@example.com', phone: '+1 (555) 567-8901', specialization: 'Практика', status: 'Неактивний' },
  { id: 5, name: 'Robert Chen', email: 'robert.c@example.com', phone: '+1 (555) 678-9012', specialization: 'Теорія', status: 'Активний' },
  { id: 6, name: 'Samantha Lee', email: 'samantha.l@example.com', phone: '+1 (555) 789-0123', specialization: 'Обидва', status: 'Активний' }
];

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const  authState  = useAuthStore();
  const [users, setUsers] = useState([...MOCK_STUDENTS]);
  const [instructors, setInstructors] = useState([...MOCK_INSTRUCTORS]);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddForm, setShowAddForm] = useState(false);

  // Effect to check if user is admin
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Handle adding a new user
  const handleUserAdded = (newUser) => {
    if (newUser.role === 'student') {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } else if (newUser.role === 'instructor') {
      setInstructors((prevInstructors) => [...prevInstructors, newUser]);
    }
    setShowAddForm(false); // Hide the form after adding
  };

  const handleViewProfile = (userId, userType) => {
    // В реальному додатку — перехід на сторінку профілю користувача
    console.log(`Перегляд профілю для ${userType} ID: ${userId}`);
  };

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader 
        title="Керування користувачами" 
        subtitle="Керуйте всіма користувачами системи"
        action={
          <Button 
            className="bg-lider-red hover:bg-red-700"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-2" />
            Додати користувача
          </Button>
        }
      />
      
      <div className="container-custom py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="students">Студенти</TabsTrigger>
            <TabsTrigger value="instructors">Інструктори</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students">
            <Card className="bg-secondary border-gray-800 p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ім'я</TableHead>
                    <TableHead>Електронна пошта</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(user.id, 'student')}
                        >
                          <Eye size={16} className="mr-2" />
                          Переглянути профіль
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="instructors">
            <Card className="bg-secondary border-gray-800 p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ім'я</TableHead>
                    <TableHead>Електронна пошта</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Спеціалізація</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructors.map((instructor) => (
                    <TableRow key={instructor.id}>
                      <TableCell className="font-medium">{instructor.name}</TableCell>
                      <TableCell>{instructor.email}</TableCell>
                      <TableCell>{instructor.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          instructor.specialization === 'Теорія' ? 'bg-blue-900/30 text-blue-400' :
                          instructor.specialization === 'Практика' ? 'bg-green-900/30 text-green-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}>
                          {instructor.specialization}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProfile(instructor.id, 'instructor')}
                        >
                          <Eye size={16} className="mr-2" />
                          Переглянути профіль
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Форма додавання користувача */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Додати користувача</h2>
              <AddUserForm onUserAdded={handleUserAdded} />
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddForm(false)}
              >
                Скасувати
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminUserManagement;
