import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuthStore} from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, AlertCircle, Calendar, CreditCard, GraduationCap, Medal } from 'lucide-react';
import { fetchStudentLessons } from '@/utils/requests/schedule/studentRequests';
import { formatEventDate, formatTime, formatDuration } from '@/utils/formatDate';


interface StudentDashboardProps {
  user: any;

}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const progress = user.progress || { completedMaterials: 3, totalMaterials: 5, completedTests: 2, testScores: [80, 90], avgTime: {m: 12, s: 45} };
  const completionPercentage = Math.round((progress.completedMaterials / progress.totalMaterials) * 100);

  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessons = await fetchStudentLessons();
        const now = new Date();
        const futureLessons = lessons
          .filter(lesson => new Date(lesson.start) >= now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 2);
        setUpcomingLessons(futureLessons);
      } catch (error) {
        setUpcomingLessons([]);
      }
    };
    fetchLessons();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_auto_auto] gap-6">

      {/* 2. Upcoming Lessons — occupies the 1st and 2nd columns of the second row */}
      <section className="md:col-span-2 md:row-start-2 md:row-end-3">
        <Card className="bg-secondary border-gray-800 h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar size={18} className="mr-2 text-lider-red" />
              Найближчі заняття
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {user.is_paid ? (
              <div className="space-y-3">
                {upcomingLessons.length > 0 ? (
                  upcomingLessons.map(lesson => (
                    <div key={lesson.id} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0">
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {lesson.title}  {/*({lesson.type === 'theory' ? 'Теоретичне заняття' : 'Практичне заняття'}) */}
                            </div>
                            <div className="text-sm text-gray-400">
                              {formatEventDate(lesson.start)} • {formatTime(lesson.start)} - {formatTime(lesson.end)} ({formatDuration(lesson.duration)})
                            </div>
                          </div>
                          <div className="ml-4">
                            {lesson.type === 'theory' ? (
                              <div className="bg-blue-900/30 px-3 py-1 rounded text-xs uppercase font-medium">
                                Теорія
                              </div>
                            ) : (
                              <div className="bg-green-900/30 px-3 py-1 rounded text-xs uppercase font-medium">
                                Практика
                              </div>
                            )}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    Немає запланованих занять
                  </div>
                )}
                <Button asChild size="sm" className="w-full mt-2 bg-lider-red hover:bg-red-700">
                  <Link to="/schedule">Переглянути усі заняття</Link>
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
                <span>Пройдено розділів</span>
                <span className="font-medium">{progress.completedMaterials}/{progress.totalMaterials}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Вирішено білетів</span>
                <span className="font-medium">{progress.completedTests}</span>
              </div>
              {progress.testScores.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>Правильних відповідей</span>
                  <span className="font-medium">
                    {Math.round(
                      progress.testScores.reduce((sum, score) => sum + score, 0) /
                      progress.testScores.length
                    )}%
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span>Середній час</span>
                <span className="font-medium">{progress.avgTime.m}хв {progress.avgTime.s}с</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Tests*/}
      <section className="md:col-span-1 md:row-start-3 md:row-end-4">
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <Medal size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Тести</h3>
            <p className="text-gray-400 mb-4 text-center">
              Перевірте ваші знання
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/tests">Почати тестування</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 5. Learning Materials */}
      <section className="md:col-span-1 md:row-start-3 md:row-end-4">
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <BookOpen size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Навчальні матеріали</h3>
            <p className="text-gray-400 mb-4 text-center">
              Вивчайте правила дорожнього руху
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
