import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Clock, BookOpen, Medal, ArrowLeft } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TestResultsProps {}

const TestResults: React.FC<TestResultsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authState  = useAuthStore();
  const { testId, topicId, customId } = useParams<{ testId?: string; topicId?: string; customId?: string }>();
  
  // Get result data from location state
  const resultData = location.state;
  
  const testType = useMemo(() => {
    if (topicId) return 'topic';
    if (customId) return 'custom';
    return 'random';
  }, [topicId, customId]);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate, location.pathname]);
  
  // Redirect if no result data is available
  React.useEffect(() => {
    if (!authState.isLoading && !resultData) {
      navigate('/tests');
    }
  }, [authState.isLoading, resultData, navigate]);
  
  if (authState.isLoading || !resultData) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  const { score, totalQuestions, correctAnswers, testData, userAnswers } = resultData;

  const isPassed = score >= 90; // 90% is passing threshold

  const wrongAnswers = totalQuestions - correctAnswers;
  const unansweredQuestions = totalQuestions - userAnswers.filter(a => a.selected_answer_id !== null).length;

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate('/tests')}
        >
          <ArrowLeft size={16} className="mr-2" />
          До тестів
        </Button>
        
        <div className="max-w-4xl mx-auto">
          {/* Results Summary Card */}
          <Card className={`border-2 ${
            isPassed ? 'border-green-500 bg-green-950/20' : 'border-red-500 bg-red-950/20'
          } mb-8`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {isPassed ? 'Тест складено!' : 'Тест не складено'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {testType === 'topic' ? `Тест за темою: ${testData.topic_name}` : 
                     testType === 'custom' ? testData.title : 
                     `Випадковий білет №${testData.ticket_number}`}
                  </CardDescription>
                </div>
                <div className={`flex items-center p-3 rounded-full ${
                  isPassed ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {isPassed ? (
                    <CheckCircle size={40} className="text-green-500" />
                  ) : (
                    <XCircle size={40} className="text-red-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-black/30 rounded-lg text-center">
                  <div className="text-gray-400 text-sm mb-1">Результат</div>
                  <div className={`text-3xl font-bold ${
                    isPassed ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {score}%
                  </div>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg text-center">
                  <div className="text-gray-400 text-sm mb-1">Вірно</div>
                  <div className="text-3xl font-bold text-green-500">
                    {correctAnswers}/{totalQuestions}
                  </div>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg text-center">
                  <div className="text-gray-400 text-sm mb-1">Невірно</div>
                  <div className="text-3xl font-bold text-red-500">
                    {wrongAnswers}/{totalQuestions}
                  </div>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg text-center">
                  <div className="text-gray-400 text-sm mb-1">Порог складання</div>
                  <div className="text-3xl font-bold">90%</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg mb-6 ${
                isPassed ? 'bg-green-950/30 border border-green-900/20' : 'bg-red-950/30 border border-red-900/20'
              }`}>
                <div className="flex items-start mb-2">
                  {isPassed ? (
                    <>
                      <Medal size={20} className="text-yellow-500 mr-2 mt-1" />
                      <div>
                        <h3 className="font-bold text-green-500">Вітаємо!</h3>
                        <p className="text-gray-300">Ви успішно склали тест. Так тримати!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-1" />
                      <div>
                        <h3 className="font-bold text-red-500">Трохи не вистачило!</h3>
                        <p className="text-gray-300">Для складання потрібно щонайменше 90%. Проаналізуйте помилки та спробуйте ще раз.</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    className={isPassed ? "bg-green-600 hover:bg-green-700" : "bg-lider-red hover:bg-red-700"}
                    onClick={() => {
                      if (testType === 'topic') {
                        navigate(`/tests/topic/${topicId}`);
                      } else if (testType === 'custom') {
                        navigate(`/tests/custom/${customId}`);
                      } else {
                        navigate('/tests/random');
                      }
                    }}
                  >
                    {isPassed ? "Повернутися до тестів" : "Спробувати ще раз"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Review */}
          <Card className="bg-secondary border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Детальний розбір</CardTitle>
              <CardDescription>
                Перегляньте всі питання та ваші відповіді
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                {testData.questions.map((question, index) => {
                  const userAnswer = userAnswers.find(a => a.question_id === question.id);
                  const selectedAnswer = question.answers.find(a => a.id === userAnswer?.selected_answer_id);
                  const correctAnswer = question.answers.find(a => a.is_correct);
                  const isCorrect = selectedAnswer?.is_correct === true;
                  const isAnswered = !!userAnswer?.selected_answer_id;
                  
                  return (
                    <div 
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        !isAnswered ? 'border-yellow-500 bg-yellow-950/10' :
                        isCorrect ? 'border-green-500 bg-green-950/10' : 
                        'border-red-500 bg-red-950/10'
                      }`}
                    >
                      <div className="flex justify-between mb-3">
                        <h3 className="font-bold text-lg">Питання {question.question_number}</h3>
                        
                        <Badge variant="outline" className={`${
                          !isAnswered ? 'text-yellow-500 border-yellow-500' :
                          isCorrect ? 'text-green-500 border-green-500' : 
                          'text-red-500 border-red-500'
                        }`}>
                          {!isAnswered ? 'Без відповіді' : isCorrect ? 'Вірно' : 'Невірно'}
                        </Badge>
                      </div>
                      
                      <p className="mb-4">{question.text}</p>
                      
                      {question.image && (
                        <div className="mb-4">
                          <AspectRatio ratio={16 / 9} className="bg-gray-950 rounded-md overflow-hidden">
                            <img 
                              src={question.image} 
                              alt="Зображення до питання" 
                              className="w-full h-full object-contain"
                            />
                          </AspectRatio>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {question.answers.map((answer) => {
                          const isSelected = answer.id === userAnswer?.selected_answer_id;
                          const isCorrectAnswer = answer.is_correct;
                          
                          return (
                            <div 
                              key={answer.id}
                              className={`p-3 rounded-md border ${
                                isSelected && isCorrectAnswer ? 'bg-green-950/20 border-green-500' : 
                                isSelected && !isCorrectAnswer ? 'bg-red-950/20 border-red-500' :
                                !isSelected && isCorrectAnswer ? 'bg-green-950/10 border-green-500/50' :
                                'bg-gray-800/40 border-gray-700'
                              }`}
                            >
                              <div className="flex items-start">
                                {isSelected && isCorrectAnswer && (
                                  <CheckCircle size={16} className="text-green-500 mr-2 mt-1 shrink-0" />
                                )}
                                {isSelected && !isCorrectAnswer && (
                                  <XCircle size={16} className="text-red-500 mr-2 mt-1 shrink-0" />
                                )}
                                {!isSelected && isCorrectAnswer && (
                                  <CheckCircle size={16} className="text-green-500/50 mr-2 mt-1 shrink-0" />
                                )}
                                <p className={`${
                                  isCorrectAnswer ? 'text-green-500' :
                                  isSelected && !isCorrectAnswer ? 'text-red-500' : 
                                  'text-gray-300'
                                }`}>
                                  {answer.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {!isAnswered && (
                        <div className="mt-4 p-2 bg-yellow-950/20 border border-yellow-800/20 rounded-md">
                          <div className="flex items-center">
                            <AlertTriangle size={14} className="text-yellow-500 mr-2" />
                            <p className="text-sm text-yellow-300">
                              Ви не відповіли на це питання.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {!isCorrect && isAnswered && (
                        <div className="mt-4 p-2 bg-green-950/20 border border-green-800/20 rounded-md">
                          <div className="flex items-center">
                            <CheckCircle size={14} className="text-green-500 mr-2" />
                            <p className="text-sm text-green-300">
                              Правильна відповідь: {correctAnswer?.text}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/tests')}
              >
                <ArrowLeft size={16} className="mr-2" />
                Повернутися до тестів
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default TestResults;
