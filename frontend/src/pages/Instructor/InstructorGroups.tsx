import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChevronDown, ChevronUp, Search, Users } from 'lucide-react';

// Мок-дані для груп інструктора
const mockGroups = [
  {
    id: '1',
    name: 'Ранкова група B1',
    schedule: 'Пн, Ср, Пт - 09:00-11:00',
    totalStudents: 8,
    students: [
      { id: '1', name: 'Іван Студент', email: 'john@example.com', progress: 65, notes: 'Добрий прогрес з паркування' },
      { id: '2', name: 'Марія Гарсія', email: 'maria@example.com', progress: 80, notes: 'Відмінні теоретичні знання' },
      { id: '3', name: 'Давид Вілсон', email: 'david@example.com', progress: 40, notes: 'Потрібно більше практики у місті' },
      { id: '4', name: 'Емілі Джонсон', email: 'emily@example.com', progress: 75, notes: 'Готова до фінального тесту' },
    ]
  },
  {
    id: '2',
    name: 'Вечірня група B2',
    schedule: 'Вт, Чт - 18:00-20:00',
    totalStudents: 6,
    students: [
      { id: '5', name: 'Михайло Сміт', email: 'michael@example.com', progress: 50, notes: 'Покращує навички їзди трасою' },
      { id: '6', name: 'Софія Родрігес', email: 'sofia@example.com', progress: 90, notes: 'Готова до іспиту' },
      { id: '7', name: 'Джеймс Браун', email: 'james@example.com', progress: 30, notes: 'Щойно почав практичні заняття' },
    ]
  },
  {
    id: '3',
    name: 'Група вихідного дня A1',
    schedule: 'Сб, Нд - 10:00-14:00',
    totalStudents: 5,
    students: [
      { id: '8', name: 'Анна Кім', email: 'anna@example.com', progress: 70, notes: 'Добрі навички керування мотоциклом' },
      { id: '9', name: 'Роберт Чен', email: 'robert@example.com', progress: 85, notes: 'Відмінно виконує технічні маневри' },
      { id: '10', name: 'Емма Девіс', email: 'emma@example.com', progress: 55, notes: 'Працює над балансом і контролем' },
      { id: '11', name: 'Томас Вайт', email: 'thomas@example.com', progress: 20, notes: 'Щойно почав базове навчання' },
      { id: '12', name: 'Олівія Мартін', email: 'olivia@example.com', progress: 60, notes: 'Поступове покращення' },
    ]
  },
];

const InstructorGroups = () => {
  const authState = useAuthStore();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Фільтрація груп за пошуком
  const filteredGroups = mockGroups.filter(group => {
    const matchesGroupName = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasMatchingStudent = group.students.some(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesGroupName || hasMatchingStudent;
  });

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  // Перехід до деталей студента
  const viewStudentDetails = (studentId: string) => {
    navigate(`/instructor/students/${studentId}`);
  };

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <PageLayout>
        <div className="container-custom py-12">
          <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold mb-2">
                Мої групи та учні
              </h1>
              <p className="text-gray-400">
                Керуйте та відстежуйте свої групи та учнів
              </p>
            </CardContent>
          </Card>

          {/* Пошук та фільтр */}
          <div className="mb-6 flex justify-end">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Пошук груп або учнів..."
                className="pl-10 bg-secondary border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Список груп */}
          <div className="space-y-6">
            {filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <Card key={group.id} className="bg-secondary border-gray-800">
                  <CardHeader className="cursor-pointer" onClick={() => toggleGroup(group.id)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center text-xl">
                          <Users size={20} className="mr-2 text-lider-red" />
                          {group.name}
                        </CardTitle>
                        <CardDescription className="mt-1">{group.schedule}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Учнів</div>
                          <div className="font-semibold">{group.totalStudents}</div>
                        </div>
                        {expandedGroups.includes(group.id) ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedGroups.includes(group.id) && (
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead>Ім'я</TableHead>
                            <TableHead>Контакт</TableHead>
                            <TableHead>Прогрес</TableHead>
                            <TableHead>Нотатки</TableHead>
                            <TableHead className="w-[120px]">Дії</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.students
                            .filter(student =>
                              searchTerm === '' ||
                              student.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(student => (
                              <TableRow key={student.id} className="border-gray-700">
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Progress value={student.progress} className="h-2" />
                                    <span className="text-sm">{student.progress}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-400">
                                  {student.notes}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-lider-red hover:text-red-400"
                                    onClick={() => viewStudentDetails(student.id)}
                                  >
                                    Детальніше
                                  </Button>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card className="bg-secondary border-gray-800 text-center p-8">
                <CardContent>
                  <p className="text-gray-400">Жодна група або учень не відповідає пошуку.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default InstructorGroups;
