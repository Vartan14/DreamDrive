import React, { useState, useEffect } from 'react';
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
import { fetchMyGroups } from '@/utils/requests/groups';


const InstructorGroups = () => {
  const authState = useAuthStore();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchMyGroups();
        setGroups(data);
      } catch (e) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Фільтрація груп за пошуком
  const filteredGroups = groups.filter(group => {
    const matchesGroupName = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasMatchingStudent = group.students.some(student =>
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesGroupName || hasMatchingStudent;
  });

  if (authState.isLoading || loading) {
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
                Мої групи та студенти
              </h1>
              <p className="text-gray-400">
                Керуйте та відстежуйте свої групи та студентів
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
                        <CardDescription className="mt-1">{group.description}</CardDescription>
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
                            <TableHead className="w-[140px]">Прізвище</TableHead>
                            <TableHead className="w-[120px]">Ім'я</TableHead>
                            <TableHead className="w-[200px]">Електронна пошта</TableHead>
                            <TableHead className="w-[150px]">Тип навчання</TableHead>
                            <TableHead className="w-[180px]">Прогрес</TableHead>
                            <TableHead className="w-[110px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.students
                            .filter(student =>
                              searchTerm === '' ||
                              `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(student => (
                              <TableRow key={student.id} className="border-gray-700">
                                <TableCell className="font-medium">{student.last_name}</TableCell>
                                <TableCell className="font-medium">{student.first_name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell className="text-sm text-gray-400">
                                  {student.type}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Progress value={student.progress} className="h-2 min-w-[100px]" />
                                    <span className="text-sm">{student.progress}%</span>
                                  </div>
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
