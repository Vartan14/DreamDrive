import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TestTopicsList from '@/components/tests/TestTopicsList';
import CustomTests from '@/components/tests/CustomTests';
import RandomTest from '@/components/tests/RandomTest';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, BookOpen, FileCheck, CheckCircle, XCircle } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

// Mock test results data
const mockTestResults = [
  {
    id: "r1",
    date: "2025-05-12T14:30:00Z",
    score: 18,
    total: 20,
    time_spent: 870, // 14m 30s in seconds
    status: "passed"
  },
  {
    id: "r2",
    date: "2025-05-10T17:10:00Z",
    score: 15,
    total: 20,
    time_spent: 1030, // 17m 10s in seconds
    status: "failed"
  },
  {
    id: "r3",
    date: "2025-05-07T13:45:00Z",
    score: 20,
    total: 20,
    time_spent: 825, // 13m 45s in seconds
    status: "passed"
  }
];

const Tests = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState(mockTestResults);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Додаємо перевірку для студентів без підписки
  if (authState.user?.role === 'student' && authState.user.is_paid === false) {
    return (
      <PageLayout>
        <PageHeader 
          title="Тести" 
          subtitle="Доступ до тестів можливий лише з активною підпискою"
        />
        <div className="container-custom py-12">
          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle size={48} className="text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Потрібна підписка</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Щоб отримати доступ до тестів, потрібна активна підписка.
                Оформіть підписку, щоб проходити інтерактивні тести.
              </p>
              <Button 
                className="bg-lider-red hover:bg-red-700"
                onClick={() => navigate('/payments')}
              >
                Оформити підписку
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  // Format time for display (seconds -> minutes:seconds)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}хв ${secs}с`;
  };

  // Handle starting the random test
  const handleStartRandomTest = () => {
    navigate('/tests/random');
  };

  // Handle selecting a topic
  const handleTopicSelected = (topicId: string) => {
    navigate(`/tests/topic/${topicId}`);
  };

  // Handle selecting a custom test
  const handleTestSelected = (testId: string) => {
    navigate(`/tests/custom/${testId}`);
  };

  // Handle viewing test details
  const handleViewTestResult = (resultId: string) => {
    navigate(`/tests/results/${resultId}`);
  };

  // Handle viewing all test history
  const handleViewAllHistory = () => {
    navigate('/tests/history');
  };

  // Loading state
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
        title="Тренувальні тести" 
        subtitle="Перевірте свої знання за допомогою наших тренувальних тестів"
      />

      <div className="container-custom py-8">
        <Tabs defaultValue="random">
          {/* Tab list with consistent icon alignment */}
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger 
              value="random" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Іспит</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="topics" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>За темами</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              <div className="flex items-center justify-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>Призначені</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="random">
            <div className="space-y-6">
              <RandomTest onStartTest={handleStartRandomTest} />

              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle>Попередні результати іспитів</CardTitle>
                  <CardDescription>
                    Ваші останні результати тренувальних тестів
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testResults.length === 0 ? (
                    <p className="text-center py-4 text-gray-400">
                      Ви ще не проходили випадкові тести. Почніть тест, щоб побачити тут свої результати.
                    </p>
                  ) : (
                    testResults.map((result) => (
                      <Card key={result.id} className="bg-gray-800/40 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-gray-400">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(result.date)}</span>
                            </div>

                            {result.status === "passed" ? (
                              <Badge className="bg-green-600">Складено</Badge>
                            ) : (
                              <Badge className="bg-red-600">Не складено</Badge>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Результат: {result.score}/{result.total}</div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock size={14} className="mr-1" />
                                <span>Час: {formatTime(result.time_spent)}</span>
                              </div>
                            </div>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewTestResult(result.id)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              Детальніше
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>

                {testResults.length > 0 && (
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-700"
                      onClick={handleViewAllHistory}
                    >
                      Переглянути всю історію тестів
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <TestTopicsList onTopicSelected={handleTopicSelected} />
          </TabsContent>

          <TabsContent value="custom">
            <CustomTests isInstructor={authState.user?.role === 'instructor'} onTestSelected={handleTestSelected} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Tests;
