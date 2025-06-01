import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, FileText } from 'lucide-react';

import { UserData } from '@/types/userInterface';

interface InstructorDashboardProps {
  user: UserData;
}

// Мок-дані для прикладу
const upcomingLessons = [
  { id: 1, date: '2023-06-10', time: '14:00', type: 'Практика', student: 'John Student' },
  { id: 2, date: '2023-06-10', time: '16:00', type: 'Практика', student: 'Emily Johnson' },
  { id: 3, date: '2023-06-11', time: '09:00', type: 'Теорія', student: 'Групове заняття' },
  { id: 4, date: '2023-06-11', time: '11:00', type: 'Практика', student: 'Michael Smith' },
];

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8 space-y-6">
      {/* Привітання */}
      
      {/* Два блоки поруч: Керування розкладом та Мої групи */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users size={20} className="mr-2 text-lider-red" />
              Мої групи
            </CardTitle>
            <CardDescription>
              Переглядайте та керуйте своїми навчальними групами.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-lider-red hover:bg-red-700 w-full">
              <Link to="/instructor/groups">Перейти до груп</Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar size={20} className="mr-2 text-lider-red" />
              Керування розкладом
            </CardTitle>
            <CardDescription>
              Додавайте, редагуйте або переглядайте свої заняття.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-lider-red hover:bg-red-700 w-full">
              <Link to="/instructor/schedule">Перейти до розкладу</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Майбутні заняття */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar size={20} className="mr-2 text-lider-red" />
            Майбутні заняття
          </CardTitle>
          <CardDescription>
            Ваші заплановані заняття на найближчі дні
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map(lesson => (
                <div key={lesson.id} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{lesson.type} заняття</div>
                    <div className="text-sm text-gray-400">
                      {new Date(lesson.date).toLocaleDateString('uk-UA')} о {lesson.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{lesson.student}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                Немає запланованих занять
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Два блоки поруч: Керування ресурсами та Керування тестами */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen size={20} className="mr-2 text-lider-red" />
              Керування матеріалами
            </CardTitle>
            <CardDescription>
              Додавайте та оновлюйте навчальні матеріали для студентів.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-lider-red hover:bg-red-700 w-full">
              <Link to="/materials">Перейти до матеріалів</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={20} className="mr-2 text-lider-red" />
              Керування тестами
            </CardTitle>
            <CardDescription>
              Створюйте, редагуйте та переглядайте тести для учнів.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-lider-red hover:bg-red-700 w-full">
              <Link to="/instructor/tests">Перейти до тестів</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;
