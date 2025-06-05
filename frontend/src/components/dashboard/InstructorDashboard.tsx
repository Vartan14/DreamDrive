import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuthStore} from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, AlertCircle, Calendar, CreditCard, GraduationCap, Medal, Users } from 'lucide-react';
import { fetchStudentLessons } from '@/utils/requests/schedule/studentRequests';
import { formatEventDate, formatTime, formatDuration } from '@/utils/formatDate';
import { UserData } from '@/types/userInterface';
import {getTeacherEvents} from '@/utils/requests/schedule/teacherEvents';
import { fetchMyGroups } from '@/utils/requests/groups';
import { LessonEvent } from '@/types/scheduleInterface';

interface InstructorDashboardProps {
  user: any;
}

interface Group {
  id: number;
  name: string;
  description: string;
  totalStudents: number;
  type: "theory" | "practice" | "theory_practice";
  students: any[];
} 

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user }) => {

  const [upcomingLessons, setUpcomingLessons] = useState<LessonEvent[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessons = await getTeacherEvents(true);
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

    useEffect(() => {
        const fetchGroups = async () => {
        try {
            const groups = await fetchMyGroups();
            console.log('Fetched groups:', groups);
            setMyGroups(groups);
        } catch (error) {
            setMyGroups([]);
        }
        };
        fetchGroups();
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
                  <Link to="/instructor/schedule">Переглянути усі заняття</Link>
                </Button>
              </div>

          </CardContent>
        </Card>
      </section>

      {/* 3. Groups */}
      <section className="md:col-span-1 md:col-start-3 md:row-start-2 md:row-end-4">
        <Card className="bg-secondary border-gray-700 h-full flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col items-center justify-center">
            <Users size={36} className="mb-4 text-lider-red" />
            <h3 className="font-bold text-lg mb-2">Групи</h3>
            <p className="text-gray-400 mb-4 text-center">
              Управляйте своїми групами та студентами
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/instructor/groups">Перейти до груп</Link>
            </Button>
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
              Керуйте тестами та переглядайте результати студентів
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/instructor/tests">Почати тестування</Link>
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
              Переглядайте навчальні матеріали 
            </p>
            <Button asChild className="bg-lider-red hover:bg-red-700">
              <Link to="/materials">Переглянути матеріали</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
};

export default InstructorDashboard;



