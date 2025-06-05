import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, CheckCircle } from 'lucide-react';

interface TestTopicsListProps {
  onTopicSelected: (topicId: string) => void;
}

// Мок-дані - у реальному додатку це буде з API
const mockTopics = [
  {
    id: "1",
    title: "Дорожні знаки",
    description: "Вивчайте та перевіряйте знання різних дорожніх знаків",
    totalQuestions: 45,
    completionRate: 75
  },
  {
    id: "2",
    title: "Правила дорожнього руху",
    description: "Перевірте розуміння основних правил дорожнього руху та регулювань",
    totalQuestions: 60,
    completionRate: 40
  },
  {
    id: "3",
    title: "Паркування та зупинка",
    description: "Вивчайте правильні техніки паркування та правила зупинки",
    totalQuestions: 30,
    completionRate: 0
  },
  {
    id: "4",
    title: "Надзвичайні ситуації",
    description: "Як правильно реагувати на надзвичайні ситуації на дорозі",
    totalQuestions: 25,
    completionRate: 0
  },
  {
    id: "5",
    title: "Експлуатація транспортного засобу",
    description: "Базові знання про експлуатацію та обслуговування авто",
    totalQuestions: 35,
    completionRate: 20
  }
];

const TestTopicsList: React.FC<TestTopicsListProps> = ({ onTopicSelected }) => {
  const [filter, setFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  
  const filteredTopics = mockTopics.filter(topic => {
    if (!showCompleted && topic.completionRate > 0) return false;
    if (filter === 'all') return true;
    // Додайте більше фільтрів за потреби
    return true;
  });
  
  return (
    <div className="space-y-6">
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BookOpen className="mr-3 text-lider-red" />
            Тематичні тести
          </CardTitle>
          <CardDescription>
            Оберіть конкретну тему для фокусованого навчання
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Select defaultValue={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Фільтрувати теми" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">Всі теми</SelectItem>
                  <SelectItem value="incomplete">Тільки незавершені</SelectItem>
                  <SelectItem value="completed">Тільки завершені</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(!!checked)} 
              />
              <label
                htmlFor="show-completed"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Показувати розпочаті теми
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map(topic => (
              <Card 
                key={topic.id}
                className="bg-gray-800/40 border-gray-700 hover:border-lider-red/50 transition-all"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{topic.title}</span>
                    {topic.completionRate > 0 && (
                      <span className="text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded-full">
                        {topic.completionRate}% завершено
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-sm text-gray-400">
                    {topic.totalQuestions} питань
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  {topic.completionRate > 0 ? (
                    <div className="flex items-center text-green-500 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Розпочато
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Не розпочато</div>
                  )}
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-lider-red text-lider-red hover:bg-lider-red hover:text-white"
                    onClick={() => onTopicSelected(topic.id)}
                  >
                    Почати тест
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <CardTitle>Прогрес по темах</CardTitle>
          <CardDescription>
            Ваш загальний прогрес по всіх темах
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Завершено тем</div>
              <div className="text-3xl font-bold">2/5</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Відповіли на питань</div>
              <div className="text-3xl font-bold">40</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Середній бал</div>
              <div className="text-3xl font-bold">78%</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Витрачено часу</div>
              <div className="text-3xl font-bold">1г 45хв</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestTopicsList;
