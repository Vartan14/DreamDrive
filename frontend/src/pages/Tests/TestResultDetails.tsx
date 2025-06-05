import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle, HelpCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock test result data
const mockTestResult = {
  id: "r1",
  date: "2025-05-12T14:30:00Z",
  score: 18,
  total: 20,
  time_spent: 870, // 14хв 30с у секундах
  status: "passed",
  questions: [
    {
      id: "q1",
      question_text: "Під'їжджаючи до пішохідного переходу, ви повинні:",
      options: [
        "Прискоритися, щоб проїхати до того, як пішоходи вийдуть на дорогу",
        "Знизити швидкість і бути готовим зупинитися",
        "Посигналити, щоб попередити пішоходів про свою присутність",
        "Не змінювати швидкість, якщо пішоходів не видно"
      ],
      correct_answer: 1,
      user_answer: 1,
      is_correct: true,
      reply_text: "Завжди знижуйте швидкість, під'їжджаючи до пішохідних переходів, і будьте готові зупинитися, щоб пропустити пішоходів."
    },
    {
      id: "q2",
      question_text: "Що означає миготливий жовтий сигнал світлофора?",
      options: [
        "Зупиніться і чекайте зеленого",
        "Рухайтесь з обережністю",
        "Приготуйтеся зупинитися, світло скоро стане червоним",
        "Пішоходи мають пріоритет"
      ],
      correct_answer: 1,
      user_answer: 2,
      is_correct: false,
      reply_text: "Миготливий жовтий сигнал означає, що потрібно рухатися з обережністю, а не те, що світло скоро стане червоним."
    },
    {
      id: "q3",
      question_text: "Мінімальна глибина протектора шин для легкових автомобілів становить:",
      options: [
        "1,0 мм",
        "1,6 мм",
        "2,0 мм",
        "2,6 мм"
      ],
      correct_answer: 1,
      user_answer: 1,
      is_correct: true,
      reply_text: "Встановлена законом мінімальна глибина протектора шин для легкових автомобілів — 1,6 мм по центральній частині протектора по всьому колу шини."
    }
  ]
};

// Mock test results data for specific IDs
const mockTestResultsById = {
  "r1": mockTestResult,
  "r2": {
    ...mockTestResult,
    id: "r2",
    date: "2025-05-10T17:10:00Z",
    score: 15,
    total: 20,
    status: "failed"
  },
  "r3": {
    ...mockTestResult,
    id: "r3",
    date: "2025-05-07T13:45:00Z",
    score: 20,
    total: 20,
    status: "passed"
  }
};

const TestResultDetails = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch test result data
  useEffect(() => {
    if (!id) {
      setError('Не вказано ID тесту');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const result = mockTestResultsById[id as keyof typeof mockTestResultsById];
      if (result) {
        setTestResult(result);
      } else {
        setError('Результат тесту не знайдено');
      }
      setLoading(false);
    }, 500);
  }, [id]);

  // Формат дати для відображення
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Формат часу (секунди -> хвилини:секунди)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} хв ${secs} с`;
  };

  // Повернутися до тестів
  const handleBack = () => {
    navigate('/tests');
  };

  // Редірект якщо не авторизовано
  useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Loading state
  if (authState.isLoading || loading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <div className="container-custom py-20">
          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl mb-4">{error}</h2>
              <Button onClick={handleBack}>Повернутися до тестів</Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!testResult) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader 
        title="Деталі результату тесту" 
        subtitle="Перегляньте свій результат та відповіді"
      />

      <div className="container-custom py-8">
        <Button 
          variant="outline" 
          className="mb-6 border-gray-600"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          До тестів
        </Button>

        <Card className="bg-secondary border-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Підсумок тесту</CardTitle>
                <CardDescription>
                  Пройдено {formatDate(testResult.date)}
                </CardDescription>
              </div>
              <Badge className={testResult.status === "passed" ? "bg-green-600" : "bg-red-600"}>
                {testResult.status === "passed" ? "Складено" : "Не складено"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Результат</div>
                <div className="text-xl font-bold flex items-center">
                  {testResult.score}/{testResult.total}
                  <span className="text-sm ml-2 text-gray-400">
                    ({Math.round((testResult.score / testResult.total) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Витрачено часу</div>
                <div className="text-xl font-bold flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  {formatTime(testResult.time_spent)}
                </div>
              </div>

              <div className="bg-gray-800/40 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Дата проходження</div>
                <div className="text-xl font-bold flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(testResult.date)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Питання та відповіді</h2>

          {testResult.questions.map((question, index) => (
            <Card 
              key={question.id} 
              className={`border ${
                question.is_correct 
                  ? "border-green-600/30 bg-green-900/10" 
                  : "border-red-600/30 bg-red-900/10"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Питання {index + 1}</CardTitle>
                    <CardDescription>
                      {question.is_correct ? (
                        <span className="flex items-center text-green-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Вірно
                        </span>
                      ) : (
                        <span className="flex items-center text-red-400">
                          <XCircle className="h-4 w-4 mr-1" />
                          Невірно
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-lg mb-4">{question.question_text}</div>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-3 rounded-md border ${
                        optionIndex === question.correct_answer 
                          ? "bg-green-900/20 border-green-600/30" 
                          : optionIndex === question.user_answer && !question.is_correct
                            ? "bg-red-900/20 border-red-600/30"
                            : "bg-gray-800/40 border-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        {optionIndex === question.correct_answer && (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        )}
                        {optionIndex === question.user_answer && !question.is_correct && (
                          <XCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
                        )}
                        {(optionIndex !== question.correct_answer && 
                          !(optionIndex === question.user_answer && !question.is_correct)) && (
                          <div className="w-4 h-4 mr-2 flex-shrink-0" />
                        )}
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {!question.is_correct && (
                  <div className="bg-blue-900/20 border border-blue-600/30 p-4 rounded-md mt-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-blue-400 font-medium mb-1">Пояснення</div>
                        <div className="text-gray-300">{question.reply_text}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TestResultDetails;
