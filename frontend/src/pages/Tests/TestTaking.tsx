import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, Clock, ArrowLeft, ArrowRight, 
  BookmarkCheck, AlertCircle 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {questions} from '@/types/questions'

// Mock API functions - replace with actual API calls
const fetchRandomTest = async () => {
  // Симуляція затримки API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    session_id: 123,
    ticket_id: 630,
    ticket_number: "77",
    questions: questions
  };
};

const fetchTopicTest = async (topicId: string) => {
  // Симуляція затримки API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    session_id: 456,
    ticket_id: 631,
    topic_id: topicId,
    topic_name: "Дорожні знаки",
    questions: [
      {
        id: 4001,
        question_number: "2001",
        text: "До якої категорії належить цей дорожній знак?",
        image: "https://images.unsplash.com/photo-1590837343047-7ac279e5e183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHN0b3AlMjBzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        answers: [
          {
            id: 12001,
            text: "Попереджувальні знаки",
            is_correct: false
          },
          {
            id: 12002,
            text: "Регулюючі знаки",
            is_correct: true
          },
          {
            id: 12003,
            text: "Інформаційно-вказівні знаки",
            is_correct: false
          },
          {
            id: 12004,
            text: "Знаки сервісу",
            is_correct: false
          }
        ]
      },
      {
        id: 4002,
        question_number: "2002",
        text: "Якої форми більшість попереджувальних знаків?",
        answers: [
          {
            id: 12005,
            text: "Коло",
            is_correct: false
          },
          {
            id: 12006,
            text: "Трикутник",
            is_correct: true
          },
          {
            id: 12007,
            text: "Прямокутник",
            is_correct: false
          },
          {
            id: 12008,
            text: "Восьмикутник",
            is_correct: false
          }
        ]
      },
      {
        id: 4003,
        question_number: "2003",
        text: "Якого кольору заборонні знаки?",
        answers: [
          {
            id: 12009,
            text: "Зелений і білий",
            is_correct: false
          },
          {
            id: 12010,
            text: "Синій і білий",
            is_correct: false
          },
          {
            id: 12011,
            text: "Жовтий і чорний",
            is_correct: false
          },
          {
            id: 12012,
            text: "Червоний і білий",
            is_correct: true
          }
        ]
      }
    ]
  };
};

const fetchCustomTest = async (testId: string) => {
  // Симуляція затримки API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    session_id: 789,
    test_id: testId,
    title: "Передекзаменаційний тренувальний тест",
    questions: [
      {
        id: 5001,
        question_number: "3001",
        text: "Під час руху під сильним дощем ви повинні:",
        answers: [
          {
            id: 13001,
            text: "Увімкнути аварійну сигналізацію.",
            is_correct: false
          },
          {
            id: 13002,
            text: "Збільшити дистанцію та зменшити швидкість.",
            is_correct: true
          },
          {
            id: 13003,
            text: "Їхати по центру смуги, щоб уникнути калюж.",
            is_correct: false
          },
          {
            id: 13004,
            text: "Моргати фарами, щоб попередити інших водіїв.",
            is_correct: false
          }
        ]
      },
      {
        id: 5002,
        question_number: "3002",
        text: "Що слід робити, якщо автомобіль почав заносити?",
        answers: [
          {
            id: 13005,
            text: "Різко натиснути на гальма.",
            is_correct: false
          },
          {
            id: 13006,
            text: "Керувати у протилежний бік від заносу.",
            is_correct: false
          },
          {
            id: 13007,
            text: "Керувати у той бік, куди потрібно рухатися.",
            is_correct: true
          },
          {
            id: 13008,
            text: "Прискоритися, щоб відновити контроль.",
            is_correct: false
          }
        ]
      }
    ]
  };
};

const submitTestAnswers = async (answers: any) => {
  // Симуляція затримки API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Повертаємо мок-відповідь
  return {
    success: true,
    message: "Відповіді на тест успішно надіслані",
    resultId: "12345"
  };
};

interface Question {
  id: number;
  question_number: string;
  text: string;
  image?: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface TestData {
  session_id: number;
  ticket_id?: number;
  test_id?: string;
  ticket_number?: string;
  topic_id?: string;
  topic_name?: string;
  title?: string;
  questions: Question[];
}

interface UserAnswer {
  question_id: number;
  selected_answer_id: number | null;
  answered_at: string;
}

const TestTaking = () => {
  const { testId, topicId, customId } = useParams<{ testId?: string; topicId?: string; customId?: string }>();
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [testType, setTestType] = useState<'random' | 'topic' | 'custom'>('random');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Fetch test data based on the test type
  useEffect(() => {
    const loadTestData = async () => {
      setLoading(true);
      
      try {
        let data: TestData;
        
        if (topicId) {
          // Topic-based test
          data = await fetchTopicTest(topicId);
          setTestType('topic');
        } else if (customId) {
          // Custom test
          data = await fetchCustomTest(customId);
          setTestType('custom');
        } else {
          // Random test (default)
          data = await fetchRandomTest();
          setTestType('random');
        }
        
        setTestData(data);
        
        // Initialize user answers
        const initialAnswers = data.questions.map(question => ({
          question_id: question.id,
          selected_answer_id: null,
          answered_at: ""
        }));
        
        setUserAnswers(initialAnswers);
        
        // Set time limit (in minutes) - different for different test types
        // Only random and custom tests have time limits
        const timeLimit = testType === 'random' ? 20 : 
                          testType === 'custom' ? 30 : 0;
        setTimeRemaining(timeLimit * 60); // Convert to seconds
      } catch (error) {
        console.error('Error loading test data:', error);
        toast({
          title: "Error",
          description: "Failed to load test data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (authState.user) {
      loadTestData();
    }
  }, [authState.user, topicId, customId, testId, toast]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate]);
  
  // Timer countdown for random and custom tests
  // For topic tests, track elapsed time instead
  useEffect(() => {
    if (!testStarted) return;
    
    const timer = setInterval(() => {
      if (testType === 'topic') {
        // For topic tests, just count elapsed time
        setElapsedSeconds(prev => prev + 1);
      } else if (timeRemaining > 0) {
        // For random and custom tests, count down
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, timeRemaining, testType]);
  
  // Start the test
  const handleStartTest = () => {
    setTestStarted(true);
    toast({
      title: "Test started",
      description: testType === 'topic' 
        ? `Good luck! Take your time to complete all questions.`
        : `Good luck! Complete all questions before the time runs out.`
    });
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answerId: number) => {
    setUserAnswers(prev => {
      const updatedAnswers = [...prev];
      
      // Find the current question's answer
      const currentAnswer = updatedAnswers.find(a => a.question_id === currentQuestion?.id);
      
      if (currentAnswer) {
        currentAnswer.selected_answer_id = answerId;
        currentAnswer.answered_at = new Date().toISOString();
      }
      
      return updatedAnswers;
    });
  };
  
  // Navigation between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < (testData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Bookmark handling
  const toggleBookmark = () => {
    const currentQuestionId = currentQuestion?.id;
    if (currentQuestionId) {
      setBookmarkedQuestions(prev => {
        if (prev.includes(currentQuestionId)) {
          return prev.filter(id => id !== currentQuestionId);
        } else {
          return [...prev, currentQuestionId];
        }
      });
    }
  };
  
  // Submit the test
  const handleSubmitTest = async () => {
    if (!testData) return;
    
    setSubmitting(true);
    
    try {
      const payload = {
        session_id: testData.session_id,
        answers: userAnswers
          .filter(answer => answer.selected_answer_id !== null)
          .map(answer => ({
            question_id: answer.question_id,
            selected_answer_id: answer.selected_answer_id,
            answered_at: answer.answered_at
          }))
      };
      
      const result = await submitTestAnswers(payload);
      
      if (result.success) {
        toast({
          title: "Test submitted",
          description: "Your test has been submitted successfully."
        });
        
        // Calculate results
        const totalQuestions = testData.questions.length;
        const answeredQuestions = userAnswers.filter(a => a.selected_answer_id !== null).length;
        let correctAnswers = 0;
        
        userAnswers.forEach(userAnswer => {
          const question = testData.questions.find(q => q.id === userAnswer.question_id);
          if (question && userAnswer.selected_answer_id) {
            const correctAnswer = question.answers.find(a => a.is_correct);
            if (correctAnswer && userAnswer.selected_answer_id === correctAnswer.id) {
              correctAnswers++;
            }
          }
        });
        
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Navigate to results page
        if (testType === 'topic') {
          navigate(`/tests/topic/${topicId}/results`, { state: { 
            score, 
            totalQuestions, 
            answeredQuestions, 
            correctAnswers,
            testData,
            userAnswers,
            timeSpent: elapsedSeconds
          }});
        } else if (testType === 'custom') {
          navigate(`/tests/custom/${customId}/results`, { state: { 
            score, 
            totalQuestions, 
            answeredQuestions, 
            correctAnswers,
            testData,
            userAnswers 
          }});
        } else {
          navigate(`/tests/results`, { state: { 
            score, 
            totalQuestions, 
            answeredQuestions, 
            correctAnswers,
            testData,
            userAnswers 
          }});
        }
      } else {
        throw new Error("Failed to submit test");
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive"
      });
      setSubmitting(false);
    }
  };
  
  // Format time remaining or elapsed
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress
  const calculateProgress = () => {
    const totalQuestions = testData?.questions.length || 1;
    const answeredQuestions = userAnswers.filter(answer => answer.selected_answer_id !== null).length;
    return (answeredQuestions / totalQuestions) * 100;
  };
  
  // Get current question
  const currentQuestion = testData?.questions[currentQuestionIndex];
  const isBookmarked = currentQuestion ? bookmarkedQuestions.includes(currentQuestion.id) : false;
  const userAnswer = currentQuestion ? userAnswers.find(a => a.question_id === currentQuestion.id) : undefined;
  
  // Loading state
  if (authState.isLoading || loading) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <Card className="bg-secondary border-gray-800 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-64 bg-gray-700" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40 bg-gray-700 mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // No test data found
  if (!testData) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl mb-4">Тест не знайдено</h2>
          <p className="text-gray-400 mb-6">
            Тест, який ви шукаєте, не існує або був видалений.
          </p>
          <Button 
            onClick={() => navigate('/tests')}
            className="bg-lider-red hover:bg-red-700"
          >
            Повернутися до тестів
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container-custom py-8">
        {!testStarted ? (
          <Card className="bg-secondary border-gray-800 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {testType === 'topic' ? `Тест за темою: ${testData.topic_name}` : 
                 testType === 'custom' ? testData.title : 
                 `Випадковий білет №${testData.ticket_number}`}
              </CardTitle>
              <CardDescription>
                {testType === 'topic' ? "Дайте відповіді на питання цієї теми" : 
                 testType === 'custom' ? "Користувацький тест, створений вашим інструктором" : 
                 "Дайте відповіді на всі питання у цьому випадковому білеті"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <span className="font-medium">Деталі тесту:</span>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>{testData.questions.length} питань</li>
                  {testType !== 'topic' && (
                    <li>
                      {testType === 'random' ? '20 хвилин' : '30 хвилин'} на виконання
                    </li>
                  )}
                  {testType === 'topic' && (
                    <li>
                      Без обмеження часу — вивчайте матеріал у зручному темпі
                    </li>
                  )}
                  <li>Ви можете вільно переходити між питаннями</li>
                  <li>Потрібно відповісти на всі питання для завершення тесту</li>
                </ul>
              </div>
              
              <div className="p-4 bg-black/30 border border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Важливо:</h3>
                <p className="text-gray-300 text-sm">
                  {testType === 'topic' 
                    ? "Це навчальна сесія. Не поспішайте, уважно ознайомтесь з кожним питанням та відповіддю."
                    : "Після початку тесту таймер почне відлік. Переконайтеся, що у вас достатньо часу для проходження тесту."}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                className="bg-lider-red hover:bg-red-700" 
                onClick={handleStartTest}
              >
                Почати тест
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header with timer and progress */}
            <div className="bg-black/80 backdrop-blur-lg p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-3 md:mb-0">
                <h1 className="text-xl font-bold">
                  {testType === 'topic' ? `Тест за темою: ${testData.topic_name}` : 
                   testType === 'custom' ? testData.title : 
                   `Білет №${testData.ticket_number}`}
                </h1>
                <div className="text-sm text-gray-400">
                  Питання {currentQuestionIndex + 1} з {testData.questions.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${
                  testType !== 'topic' && timeRemaining < 60 ? 'text-red-500' : 
                  testType !== 'topic' && timeRemaining < 180 ? 'text-yellow-500' : 'text-gray-300'
                }`}>
                  <Clock size={20} />
                  <span className="font-mono font-bold">
                    {testType === 'topic' 
                      ? `${formatTime(elapsedSeconds)} минуло` 
                      : formatTime(timeRemaining)}
                  </span>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-lider-red text-lider-red hover:bg-red-950/30">
                      Завершити тест
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Це завершить тест і відправить ваші поточні відповіді. Ви не зможете повернутися до цього тесту пізніше.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Скасувати</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleSubmitTest}
                        className="bg-lider-red hover:bg-red-700"
                      >
                        Відправити тест
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Прогрес</span>
                <span className="font-medium">
                  {userAnswers.filter(a => a.selected_answer_id !== null).length} / {testData.questions.length} відповіли
                </span>
              </div>
              <Progress 
                value={calculateProgress()} 
                className="h-2 bg-gray-800"
              />
            </div>
            
            {/* Question card */}
            <Card className="bg-secondary border-gray-800 mb-6">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Питання {currentQuestion?.question_number}
                  </CardTitle>
                  <CardDescription>
                    {userAnswer?.selected_answer_id !== null 
                      ? "Ви відповіли на це питання" 
                      : "Оберіть правильну відповідь"}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleBookmark}
                  className={isBookmarked ? "text-yellow-500" : "text-gray-500"}
                >
                  <BookmarkCheck size={20} />
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {currentQuestion?.image && (
                  <div className="flex justify-center mb-2">
                    <img 
                      src={currentQuestion.image} 
                      alt="Зображення до питання" 
                      className="max-h-[290px] max-w-[516px] object-contain rounded-md"
                    />
                  </div>
                )}
                
                <div className="text-lg font-medium">
                  {currentQuestion?.text}
                </div>
                
                <RadioGroup 
                  value={userAnswer?.selected_answer_id?.toString() || ""}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion?.answers.map((option) => (
                    <div 
                      key={option.id}
                      className={`flex items-center p-4 rounded-lg border ${
                        userAnswer?.selected_answer_id === option.id
                          ? "border-lider-red bg-red-950/20" 
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <RadioGroupItem 
                        value={option.id.toString()} 
                        id={`option-${option.id}`} 
                        className="mr-3"
                      />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft size={16} className="mr-2" />
                Попереднє
              </Button>
              
              {currentQuestionIndex === testData.questions.length - 1 ? (
                <Button 
                  className="bg-lider-red hover:bg-red-700"
                  onClick={handleSubmitTest}
                  disabled={submitting || userAnswers.some(a => a.selected_answer_id === null)}
                >
                  {submitting ? 
                    "Відправлення..." : 
                    userAnswers.some(a => a.selected_answer_id === null) ?
                    "Дайте відповіді на всі питання" :
                    "Завершити тест"
                  }
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  className="bg-lider-red hover:bg-red-700"
                >
                  Далі
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
            
            {/* Message if not all questions are answered */}
            {userAnswers.some(a => a.selected_answer_id === null) && currentQuestionIndex === testData.questions.length - 1 && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800/20 rounded-md">
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-yellow-500 mr-2" />
                  <p className="text-sm text-yellow-300">
                    Ви повинні відповісти на всі питання перед завершенням тесту.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TestTaking;
