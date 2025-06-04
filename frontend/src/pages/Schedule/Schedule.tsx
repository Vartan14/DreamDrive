import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, AlertCircle, User, MapPin, Car, Plus, Check } from 'lucide-react'; // Added Plus and Check
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchAvailablePracticeLessons } from '@/utils/requests/schedule/studentRequests';
import { LessonEvent } from '@/types/scheduleInterface';
import {bookPracticeLesson, fetchStudentLessons} from '@/utils/requests/schedule/studentRequests';
import { formatEventDate, formatTime, formatDuration } from '@/utils/formatDate';
import { filials } from '@/types/filials';
import { LessonDetailModal } from '@/components/schedule/LessonDetailModal';


const Schedule = () => {
  const navigate = useNavigate();
  const authState  = useAuthStore();
  const { toast } = useToast();
  const user = authState.user;
  const isSubscribed = user?.role === 'student' && user.is_paid;
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [scheduleData, setScheduleData] = useState<LessonEvent[]>([]);
  const [availablePracticalLessons, setAvailablePracticalLessons] = useState<LessonEvent[]>([]);
  const [isLessonDetailsOpen, setIsLessonDetailsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [hasBookedLesson, setHasBookedLesson] = useState(false);

  React.useEffect(() => {
    checkBookedLessons();
  }, [scheduleData]);
  // Fetch available practical lessons when date changes
  React.useEffect(() => {
    if (date && user?.role === 'student' && isSubscribed) {
      fetchAvailablePractice(date);
    }
  }, [date, user?.role, isSubscribed]);

  // Функція для отримання слотів з API
  const fetchAvailablePractice = async (selectedDate: Date) => {
    try {
      const allLessons = await fetchAvailablePracticeLessons();

      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const selectedDateStr = nextDay.toISOString().split('T')[0];
      console.log('Selected date:', selectedDateStr);

      const filteredLessons = allLessons.filter(lesson => {
        const lessonDate = new Date(lesson.start).toISOString().split('T')[0];
        return lessonDate === selectedDateStr;
      });

      setAvailablePracticalLessons(filteredLessons);
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося отримати доступні практичні заняття.",
        variant: "destructive"
      });
    }
  };

  const handleBookLesson = async (slotId: number) => {
    setIsBooking(true);
    setSelectedSlot(slotId);

    try {
      await bookPracticeLesson(slotId.toString());

      setSelectedSlot(null);
      setAvailablePracticalLessons(prevLessons =>
        prevLessons.filter(lesson => lesson.id.toString() !== slotId.toString())
      );
      setHasBookedLesson(true);

      // Оновлюємо розклад студента після бронювання
      await fetchStudentData();

      toast({
        title: 'Заняття заброньовано',
        description: 'Ваше практичне заняття успішно заброньовано.',
      });
    } catch (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося забронювати заняття.',
        variant: 'destructive',
      });
    } finally {
        setIsBooking(false);
    }
  };
  
  const handleViewLessonDetails = (lesson) => {
    setSelectedLesson(lesson);
    setIsLessonDetailsOpen(true);
  };



  React.useEffect(() => {
    if (user?.role === 'student' && isSubscribed) {
      fetchStudentData();
    }
  }, [user?.role, isSubscribed]);

  const checkBookedLessons = async () => {
    if (scheduleData.some(lesson => lesson.type === 'practical')) {
      setHasBookedLesson(true);
    } else {
      setHasBookedLesson(false);
    }
  }


  React.useEffect(() => {
    checkBookedLessons();
  }, [date]);

  const fetchStudentData = async () => {
    try {
      const studentLessons: LessonEvent[] = await fetchStudentLessons();
      setScheduleData(studentLessons);

    } catch (error) {
      console.error('Failed to fetch student lessons:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося отримати розклад студента.',
        variant: 'destructive',
      });
    }
  };

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </PageLayout>
    );
  }

  if (user?.role === 'student' && !isSubscribed) {
    return (
      <PageLayout>
        <PageHeader 
          title="Розклад занять" 
          subtitle="Записуйтесь та керуйте своїми заняттями"
        />
        <div className="container-custom py-12">
          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle size={48} className="text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Потрібна підписка</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Щоб отримати доступ до системи розкладу занять, потрібна активна підписка.
                Оформіть підписку, щоб записуватись на практичні та теоретичні заняття.
              </p>
              <Button 
                className="bg-lider-red hover:bg-red-700"
                onClick={() => navigate('/payments')}
              >
                Оформити підписку
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader 
        title="Розклад занять" 
        subtitle={user?.role === 'student' 
          ? "Записуйтесь та керуйте своїми заняттями" 
          : "Керуйте своїм розкладом викладання"
        }
      />
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="bg-secondary border-gray-800 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon size={18} className="mr-2 text-lider-red" />
                Оберіть дату
              </CardTitle>
              <CardDescription>              
                  Оберіть дату, щоб побачити доступні для бронювання заняття                                  
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border border-gray-700 rounded-md p-3 pointer-events-auto"
                classNames={{
                  day_selected: "bg-lider-red text-white hover:bg-lider-red hover:text-white",
                  day_today: "bg-gray-800 text-white",
                }}
              />
                        
            </CardContent>
          </Card>

          {/* Available Practical Lessons */}
          {user?.role === 'student' && (
            <Card className="bg-secondary border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock size={18} className="mr-2 text-lider-red" />
                  Доступні практичні заняття
                </CardTitle>
                <CardDescription>
                  {date ? (
                    <>Обрана дата: {date.toLocaleDateString('uk-UA')}</>
                  ) : (
                    <>Оберіть дату, щоб побачити доступні заняття</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasBookedLesson ? (
                  <div className="text-center py-10 text-green-500 h-[340px] flex flex-col justify-center">
                    <Check size={32} className="mx-auto mb-3" />
                    <p className="mb-1">У вас уже є заброньоване заняття</p>
                    
                  </div>
                ) : availablePracticalLessons && availablePracticalLessons.length > 0 ? (
                  <ScrollArea className="h-[340px] pr-4">
                    <div className="space-y-4">
                      {availablePracticalLessons.map(lesson => (
                        <div 
                          key={lesson.id}
                          className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="font-medium flex items-center">
                                <span className="inline-block w-2 h-2 bg-lider-red rounded-full mr-2"></span>
                                Практичне заняття - {formatDuration(lesson.duration)}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <Clock size={14} className="inline mr-1" />
                                {formatTime(lesson.start)}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <User size={14} className="inline mr-1" />
                                {lesson.instructor_name}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <MapPin size={14} className="inline mr-1" />
                                {lesson.location}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <Car size={14} className="inline mr-1" />
                                {lesson.car}
                              </div>
                            </div>
                            
                            <div className="mt-3 md:mt-0">
                              <Button 
                                className="bg-lider-red hover:bg-red-700"
                                disabled={isBooking && selectedSlot.toString() === lesson.id.toString()}
                                onClick={() => handleBookLesson(Number(lesson.id))}
                              >
                                {isBooking && selectedSlot.toString() === lesson.id.toString() ? (
                                  <>
                                    <span className="animate-spin mr-2">⌛</span>
                                    Бронювання...
                                  </>
                                ) : (
                                  'Забронювати'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10 text-gray-400 h-[340px] flex flex-col justify-center">
                    <Clock size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="mb-1">Немає доступних практичних занять на обрану дату</p>
                    <p className="text-sm">Спробуйте обрати іншу дату</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Upcoming lessons */}
        <Card className="bg-secondary border-gray-800 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon size={18} className="mr-2 text-lider-red" />
              Ваші майбутні заняття
            </CardTitle>
            <CardDescription>
              Заплановані заняття для вас
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduleData.length > 0 ? (
              <div className="space-y-4">
                {scheduleData.map(lesson => (
                  <div 
                    key={lesson.id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="font-medium flex items-center">
                        
                            {lesson.type === 'theory' ? (
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                              ) : (
                                <div
                                  className="w-3 h-3 rounded-full mr-3 bg-orange-500"
                                    
                                      
                                
                                ></div>
                              )}
                          {lesson.type === 'theory' ? 'Теоретичне заняття' : 'Практичне заняття'} - {formatDuration(lesson.duration)} 
                        
                          
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <CalendarIcon size={14} className="inline mr-1" />
                          {formatEventDate(lesson.start)} • {formatTime(lesson.start)}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <User size={14} className="inline mr-1" />
                          {lesson.instructor_name}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <MapPin size={14} className="inline mr-1" />
                          {filials.find(f => f.id === lesson.filial_id.toString())?.name || 'Невідомо'}
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-lider-red/30 text-lider-red hover:bg-red-950/20"
                          onClick={() => handleViewLessonDetails(lesson)}
                        >
                          Детальніше
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <CalendarIcon size={32} className="mx-auto mb-3 opacity-50" />
                <p>Немає запланованих занять</p>
              </div>
            )}
          </CardContent>
        </Card>
        
      </div>

      {/* Lesson Details Modal */}
      <LessonDetailModal
        isOpen={isLessonDetailsOpen}
        onClose={() => setIsLessonDetailsOpen(false)}
        lesson={selectedLesson}
        canEdit={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />      
          </PageLayout>
        );
};

export default Schedule;
