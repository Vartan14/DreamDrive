import React from 'react';
import { Link } from 'react-router-dom';
import {useAuthStore} from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, AlertCircle, Calendar, CreditCard, GraduationCap, Medal } from 'lucide-react';

interface StudentDashboardProps {
  user: any;

}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  // Мок-дані для прикладу
  const progress = user.progress || { completedMaterials: 3, totalMaterials: 5, completedTests: 2, testScores: [80, 90] };
  const completionPercentage = Math.round((progress.completedMaterials / progress.totalMaterials) * 100);

  const upcomingLessons = [
    { id: 1, date: '2023-06-10', time: '14:00', type: 'Практичне', instructor: 'Alex Instructor' },
    { id: 2, date: '2023-06-12', time: '10:00', type: 'Теорія', instructor: 'Maria Teacher' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto_auto] gap-6">

      {/* 2. Upcoming Lessons — occupies the 1st and 2nd columns of the second row */}
      <section className="md:col-span-2 md:row-start-2 md:row-end-3">
        <Card className="bg-secondary border-gray-800 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar size={18} className="mr-2 text-lider-red" />
              Майбутні заняття
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {user.is_paid ? (
              <div className="space-y-3">
                {upcomingLessons.length > 0 ? (
                  upcomingLessons.map(lesson => (
                    <div key={lesson.id} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0">
                      <div>
                        <div className="font-medium">{lesson.type} заняття</div>
                        <div className="text-sm text-gray-400">
                          {new Date(lesson.date).toLocaleDateString('uk-UA')} о {lesson.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{lesson.instructor}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    Немає запланованих занять
                  </div>
                )}
                <Button asChild size="sm" className="w-full mt-2 bg-lider-red hover:bg-red-700">
                  <Link to="/schedule">Переглянути розклад</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="mx-auto mb-2 text-yellow-500" size={24} />
                <p className="text-gray-400 mb-3">Доступно після підписки</p>
                <Button asChild size="sm" className="bg-lider-red hover:bg-red-700">
                  <Link to="/payments">Оформити підписку</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 3. Learning Progress — the 3rd column of the second row */}
      <section className="md:col-span-1 md:col-start-3 md:row-start-2 md:row-end-3">
        <Card className="bg-secondary border-gray-800 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <GraduationCap size={18} className="mr-2 text-lider-red" />
              Прогрес навчання
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span>Завершено</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-gray-700" />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Матеріалів завершено</span>
                <span className="font-medium">{progress.completedMaterials}/{progress.totalMaterials}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Тестів завершено</span>
                <span className="font-medium">{progress.completedTests}</span>
              </div>
              {progress.testScores.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Середній бал</span>
                  <span className="font-medium">
                    {Math.round(
                      progress.testScores.reduce((sum, score) => sum + score, 0) /
                      progress.testScores.length
                    )}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Tests — occupies the first column of the third row */}
      <section className="md:col-span-1 md:row-start-3 md:row-end-4">
        <Card className="bg-gradient-to-br from-lider-red/20 to-black border-lider-red/30 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <Medal size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Тести</h3>
            <p className="text-gray-400 mb-4 text-center">
              Перевірте свої знання та підготуйтеся до іспиту.
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/tests">Почати тестування</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 5. Learning Materials — occupies the second column of the third row */}
      <section className="md:col-span-1 md:row-start-3 md:row-end-4">
        <Card className="bg-gradient-to-br from-gray-800/30 to-black border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <BookOpen size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Навчальні матеріали</h3>
            <p className="text-gray-400 mb-4 text-center">
              Вивчайте теорію та практику водіння.
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/materials">Переглянути матеріали</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 6. Subscription Status — occupies the third column of the third row */}
      <section className="md:col-span-1 md:row-start-3 md:row-end-4">
        <Card className="bg-secondary border-gray-800 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CreditCard size={18} className="mr-2 text-lider-red" />
              Статус підписки
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
              user.is_paid 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-yellow-900/30 text-yellow-400'
            }`}>
              {user.is_paid ? (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Активна підписка
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="mr-1" />
                  Немає підписки
                </>
              )}
            </div>
            {user.is_paid ? (
              <>
                <p className="text-gray-400 mb-4 text-center">
                  Ви маєте повний доступ до матеріалів та розкладу.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/payments">Керувати підпискою</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-4 text-center">
                  Оформіть підписку для повного доступу до навчання.
                </p>
                <Button asChild className="bg-lider-red hover:bg-red-700">
                  <Link to="/payments">Оформити підписку</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentDashboard;
