import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Search, Plus, FileText, User, Calendar, Clock, CheckCircle, XCircle, Edit, Eye, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

// Мок-дані для тестів
const mockTests = [
  {
    id: "101",
    title: "Передекзаменаційний тренувальний тест",
    description: "Комплексний тест, що охоплює всі основні теми",
    created_at: "2025-04-05T10:30:00Z",
    question_count: 30,
    time_limit: 25,
    is_published: true,
    student_count: 15
  },
  {
    id: "102",
    title: "Вікторина з дорожніх знаків",
    description: "Особливий акцент на розпізнаванні та розумінні дорожніх знаків",
    created_at: "2025-04-10T14:20:00Z",
    question_count: 15,
    time_limit: 12,
    is_published: true,
    student_count: 12
  },
  {
    id: "103",
    title: "Складні дорожні ситуації",
    description: "Складні сценарії для досвідчених водіїв",
    created_at: "2025-04-15T09:15:00Z",
    question_count: 20,
    time_limit: 18,
    is_published: false,
    student_count: 0
  }
];

const TestsManagement = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState(mockTests);
  const [filteredTests, setFilteredTests] = useState(mockTests);
  
  // Фільтрація тестів за пошуковим запитом
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTests(tests);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = tests.filter(test => 
      test.title.toLowerCase().includes(query) ||
      test.description.toLowerCase().includes(query)
    );
    setFilteredTests(filtered);
  }, [searchQuery, tests]);
  
  // Форматування дати для відображення
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };
  
  // Зміна статусу публікації тесту
  const togglePublishedStatus = (testId: string) => {
    setTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, is_published: !test.is_published }
          : test
      )
    );
    
    const test = tests.find(t => t.id === testId);
    if (test) {
      toast({
        title: test.is_published ? "Тест знято з публікації" : "Тест опубліковано",
        description: `"${test.title}" ${test.is_published ? "був знятий з публікації." : "опубліковано."}`
      });
    }
  };
  

  
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <PageLayout>
        <PageHeader 
          title="Управління тестами" 
          subtitle="Створюйте та керуйте власними тестами для ваших учнів"
        />
        
        <div className="container-custom py-8">
          <Card className="bg-secondary border-gray-800 mb-6">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle>Користувацькі тести</CardTitle>
                  <CardDescription>
                    Створюйте, редагуйте та керуйте тестами для ваших учнів
                  </CardDescription>
                </div>
                
                <Button 
                  onClick={() => navigate('/instructor/tests/create')}
                  className="bg-lider-red hover:bg-red-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Створити новий тест
                </Button>
              </div>
            </CardHeader>
            
           
                
            <CardContent>
                
              
                  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                    <div className="md:w-1/2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Пошук тестів..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {filteredTests.length === 0 ? (
                    <div className="text-center py-12 border border-gray-700 rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                      <h3 className="text-lg font-medium mb-2">Тестів не знайдено</h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-4">
                        {searchQuery ? "Жоден тест не відповідає вашому запиту." : "Ви ще не створили жодного тесту."}
                      </p>
                      {!searchQuery && (
                        <Button 
                          onClick={() => navigate('/instructor/tests/create')}
                          className="bg-lider-red hover:bg-red-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Створити перший тест
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-700 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-800">
                          <TableRow className="hover:bg-gray-800/80">
                            <TableHead className="text-gray-300">Назва</TableHead>
                            <TableHead className="text-gray-300">Створено</TableHead>
                            <TableHead className="text-gray-300">Питань</TableHead>
                            <TableHead className="text-gray-300">Учнів</TableHead>
                            <TableHead className="text-gray-300">Статус</TableHead>
                            <TableHead className="text-right">Дії</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTests.map((test) => (
                            <TableRow key={test.id} className="hover:bg-gray-800/50">
                              <TableCell className="font-medium">
                                <div className="max-w-[200px] truncate">
                                  {test.title}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  {test.description}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span>{formatDate(test.created_at)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3 text-gray-400" />
                                  <span>{test.question_count}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {test.time_limit} хв. ліміт часу
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span>{test.student_count}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {test.is_published ? (
                                  <Badge className="bg-green-600">Опубліковано</Badge>
                                ) : (
                                  <Badge variant="outline" className="border-gray-500 text-gray-400">Чернетка</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Відкрити меню</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                                    <DropdownMenuItem onClick={() => navigate(`/instructor/tests/edit/${test.id}`)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Редагувати</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => togglePublishedStatus(test.id)}>
                                      {test.is_published ? (
                                        <>
                                          <XCircle className="mr-2 h-4 w-4" />
                                          <span>Зняти з публікації</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          <span>Опублікувати</span>
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    {test.student_count > 0 && (
                                      <DropdownMenuItem onClick={() => navigate(`/instructor/tests/performance/${test.id}`)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>Переглянути результати</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
    
            
              
            </CardContent>
          </Card>
          
          <Card className="bg-secondary border-gray-800">
            <CardHeader>
              <CardTitle>Успішність учнів</CardTitle>
              <CardDescription>
                Переглядайте, як учні проходять ваші тести
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800/40 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Загальна успішність</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">78%</div>
                    <p className="text-gray-400">Середній бал по всіх тестах</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 hover:bg-gray-800"
                      onClick={() => toast({
                        title: "Скоро буде доступно",
                        description: "Детальна аналітика з'явиться у наступних оновленнях."
                      })}
                    >
                      Переглянути аналітику
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gray-800/40 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Остання активність</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-gray-400">Спроб тестів за останні 7 днів</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 hover:bg-gray-800"
                      onClick={() => toast({
                        title: "Скоро буде доступно",
                        description: "Хронологія активності з'явиться у наступних оновленнях."
                      })}
                    >
                      Переглянути активність
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gray-800/40 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Популярні тести</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                    <p className="text-gray-400">Тести з найбільшою кількістю спроб</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 hover:bg-gray-800"
                      onClick={() => toast({
                        title: "Скоро буде доступно",
                        description: "Статистика популярності тестів з'явиться у наступних оновленнях."
                      })}
                    >
                      Переглянути деталі
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default TestsManagement;
