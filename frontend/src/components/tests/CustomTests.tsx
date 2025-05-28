import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Clock, User, CalendarDays } from 'lucide-react';

interface CustomTestsProps {
  isInstructor: boolean;
  onTestSelected: (testId: string) => void;
}

// Мок-дані - у реальному додатку це буде з API
const mockCustomTests = [
  {
    id: "101",
    title: "Передекзаменаційний тренувальний тест",
    description: "Комплексний тест, що охоплює всі основні теми",
    createdBy: "Ім'я інструктора",
    createdAt: "2025-04-05",
    questionCount: 30,
    timeLimit: 25,
    isAvailable: true
  },
  {
    id: "102",
    title: "Вікторина з дорожніх знаків",
    description: "Особливий акцент на розпізнаванні та розумінні дорожніх знаків",
    createdBy: "Ім'я інструктора",
    createdAt: "2025-04-10",
    questionCount: 15,
    timeLimit: 12,
    isAvailable: true
  },
  {
    id: "103",
    title: "Складні дорожні ситуації",
    description: "Складні сценарії для досвідчених водіїв",
    createdBy: "Ім'я інструктора",
    createdAt: "2025-04-15",
    questionCount: 20,
    timeLimit: 18,
    isAvailable: false
  }
];

const CustomTests: React.FC<CustomTestsProps> = ({ isInstructor, onTestSelected }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  
  const handleCreateTest = () => {
    toast({
      title: "Функція скоро з'явиться",
      description: "Можливість створення тесту буде доступна у наступному оновленні."
    });
  };
  
  const availableTests = mockCustomTests.filter(test => test.isAvailable);
  const draftTests = isInstructor ? mockCustomTests.filter(test => !test.isAvailable) : [];
  
  return (
    <div className="space-y-6">
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <BookOpen className="mr-3 text-lider-red" />
                Користувацькі тести
              </CardTitle>
              <CardDescription>
                {isInstructor 
                  ? "Створюйте та керуйте власними тестами для ваших учнів" 
                  : "Проходьте тести, створені вашими інструкторами"
                }
              </CardDescription>
            </div>
            
            {isInstructor && (
              <Button 
                onClick={handleCreateTest}
                className="bg-lider-red hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Створити тест
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isInstructor ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger 
                  value="available" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Опубліковані тести
                </TabsTrigger>
                <TabsTrigger 
                  value="drafts" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Чернетки тестів
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="space-y-4">
                {renderTestsList(availableTests, onTestSelected, true)}
              </TabsContent>
              
              <TabsContent value="drafts" className="space-y-4">
                {renderTestsList(draftTests, onTestSelected, true)}
              </TabsContent>
            </Tabs>
          ) : (
            renderTestsList(availableTests, onTestSelected, false)
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <CardTitle>Ваша історія тестів</CardTitle>
          <CardDescription>
            Ваші результати проходження користувацьких тестів
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-400">
              Ви ще не проходили жодного користувацького тесту. Почніть тест, щоб побачити тут свої результати.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const renderTestsList = (
  tests: typeof mockCustomTests, 
  onTestSelected: (testId: string) => void,
  isInstructor: boolean
) => {
  if (tests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">
          {isInstructor ? "У цій категорії немає тестів. Створіть новий, щоб розпочати." : "Наразі немає доступних користувацьких тестів."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.map(test => (
        <Card 
          key={test.id}
          className="bg-gray-800/40 border-gray-700 hover:border-lider-red/50 transition-all"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {test.title}
            </CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2 pb-4">
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="flex items-center text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{test.timeLimit} хвилин</span>
              </div>
              <div className="flex items-center text-gray-400">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>{test.questionCount} питань</span>
              </div>
              <div className="flex items-center text-gray-400">
                <User className="h-3 w-3 mr-1" />
                <span>{test.createdBy}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CalendarDays className="h-3 w-3 mr-1" />
                <span>{test.createdAt}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <div className="flex w-full justify-end gap-2">
              {isInstructor && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-gray-600"
                >
                  Редагувати
                </Button>
              )}
              
              <Button 
                size="sm"
                className="bg-lider-red hover:bg-red-700"
                onClick={() => onTestSelected(test.id)}
              >
                {isInstructor ? "Переглянути" : "Почати тест"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CustomTests;
