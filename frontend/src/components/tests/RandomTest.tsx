import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, AlertTriangle } from 'lucide-react';

interface RandomTestProps {
  onStartTest: () => void;
}

const RandomTest: React.FC<RandomTestProps> = ({ onStartTest }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileText className="mr-3 text-lider-red" />
            Випадковий  білет
          </CardTitle>
          <CardDescription>
            Перевірте свої знання за допомогою випадкової вибірки питань
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Формат тесту</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-gray-700 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                  <span>20 питань, обраних випадково</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-700 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                  <span>20 хвилин на проходження тесту</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-700 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                  <span>Вільна навігація між питаннями</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-gray-700 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                  <span>Відправити відповіді можна лише після завершення всіх питань</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Оцінювання</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Для успішного проходження потрібно правильно відповісти щонайменше на 18 з 20 питань (90%).
                </p>
                
                <div className="flex items-center text-yellow-500">
                  <Clock className="mr-2" />
                  <span>Обмеження часу: 20 хвилин</span>
                </div>
                
                <div className="bg-red-950/30 border border-red-800/20 p-3 rounded-md text-sm">
                  <div className="flex items-center text-red-400 mb-1">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span className="font-medium">Увага:</span>
                  </div>
                  <p>
                    Після початку тесту таймер почне відлік і його не можна буде зупинити.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onStartTest} 
            className="bg-lider-red hover:bg-red-700 w-full md:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Почати іспит
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RandomTest;
