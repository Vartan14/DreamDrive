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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fetchAvailablePracticeLessons } from '@/utils/requests/schedule/studentRequests';
import { LessonEvent } from '@/types/scheduleInterface';

// Mock schedule data
const initialScheduleData = {
  upcomingLessons: [
    {
      id: 1,
      date: '2023-05-23',
      time: '14:00',
      duration: 90,
      type: 'Practical',
      instructor: 'Alex Instructor',
      location: 'Main Branch - 123 Main Street'
    },
    {
      id: 2,
      date: '2023-06-12',
      time: '10:00',
      duration: 60,
      type: 'Theory',
      instructor: 'Maria Teacher',
      location: 'Main Branch - 123 Main Street'
    }
  ],
};

// Mock data for available practical lessons
const mockAvailablePracticalLessons = [
  {
    id: 41,
    start_time: "2025-06-02T09:00:00Z",
    duration: "01:00:00",
    status: "available",
    filial_id: 1,
    instructor_id: 8,
    instructor_name: "John Smith",
    location: "Вулиця Шевченка, 15",
    car: "Toyota Corolla, AA1234BX",
    student_id: null,
    created_at: "2025-05-13T12:30:00Z"
  },
  {
    id: 42,
    start_time: "2025-06-02T11:00:00Z",
    duration: "01:30:00",
    status: "available",
    filial_id: 1,
    instructor_id: 9,
    instructor_name: "Alex Insturctor",
    location: "Main Branch - 123 Main Street",
    car: "Honda Civic, AA5678CE",
    student_id: null,
    created_at: "2025-05-13T12:35:00Z"
  },
  {
    id: 43,
    start_time: "2025-05-17T14:00:00Z",
    duration: "01:00:00",
    status: "available",
    filial_id: 2,
    instructor_id: 7,
    instructor_name: "Michael Brown",
    location: "Проспект Свободи, 42",
    car: "Volkswagen Golf, AA9012DF",
    student_id: null,
    created_at: "2025-05-13T12:40:00Z"
  }
];

// Vehicle options



const Schedule = () => {
  const navigate = useNavigate();
  const authState  = useAuthStore();
  const { toast } = useToast();
  const user = authState.user;
  const isSubscribed = user?.role === 'student' && user.is_paid;
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [availablePracticalLessons, setAvailablePracticalLessons] = useState<LessonEvent[]>([]);
  const [isLessonDetailsOpen, setIsLessonDetailsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Add Availability dialog state
  const [isAddAvailabilityOpen, setIsAddAvailabilityOpen] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    title: '',
    date: new Date(),
    time: '09:00',
    duration: '90',
    vehicle: 'toyota-corolla',
    location: 'Main Branch - 123 Main Street',
    type: 'Practical'
  });

  // Booked lesson state
  const [hasBookedLesson, setHasBookedLesson] = useState(false);

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!authState.isLoading && !user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, user, navigate]);

  // Fetch available practical lessons when date changes
  React.useEffect(() => {
    setHasBookedLesson(false); // Скидаємо при зміні дати
    if (date && user?.role === 'student' && isSubscribed) {
      fetchLessonsFromApi(date);
    }
  }, [date, user?.role, isSubscribed]);

  // Функція для отримання занять з API
  const fetchLessonsFromApi = async (selectedDate: Date) => {
    try {
      const allLessons = await fetchAvailablePracticeLessons();
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
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

  const handleBookLesson = (slotId: number) => {
    setIsBooking(true);
    setSelectedSlot(slotId);

    setTimeout(() => {
      setIsBooking(false);
      setSelectedSlot(null);
      setAvailablePracticalLessons(prevLessons =>
        prevLessons.filter(lesson => lesson.id.toString() !== slotId.toString())
      );
      setHasBookedLesson(true); // Позначаємо, що студент забронював урок
      toast({
        title: 'Заняття заброньовано',
        description: 'Ваше практичне заняття успішно заброньовано.',
      });
    }, 1500);
  };
  
  const handleViewLessonDetails = (lesson) => {
    setSelectedLesson(lesson);
    setIsLessonDetailsOpen(true);
  };

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Форматує тривалість (HH:MM:SS) у години українською
  const formatDuration = (duration: string) => {
    const [hours, minutes] = duration.split(':').map(Number);
    if (hours > 0 && minutes === 0) {
      return hours === 1 ? '1 година' : `${hours} години`;
    }
    if (hours > 0 && minutes > 0) {
      return `${hours},${minutes / 60 * 10} години`.replace('.0', '');
    }
    if (minutes > 0) {
      return `${minutes} хвилин`;
    }
    return '';
  };


  const handleManageScheduleClick = () => {
    navigate('/instructor/schedule');
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
                {user?.role === 'student' 
                  ? "Оберіть дату, щоб побачити доступні заняття" 
                  : "Ваш календар розкладу"
                }
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
              
              {user?.role === 'instructor' && (
                <Button 
                  className="w-full mt-4 bg-lider-red hover:bg-red-700"
                  onClick={handleManageScheduleClick}
                >
                  Manage Schedule
                </Button>
              )}
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
              {user?.role === 'student' ? 'Ваші майбутні заняття' : 'Ваші майбутні заняття з учнями'}
            </CardTitle>
            <CardDescription>
              {user?.role === 'student' ? 'Заплановані заняття для вас' : 'Заплановані заняття з вашими учнями'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduleData.upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {scheduleData.upcomingLessons.map(lesson => (
                  <div 
                    key={lesson.id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="font-medium flex items-center">
                          {lesson.type === 'Practical' ? (
                            <span className="inline-block w-2 h-2 bg-lider-red rounded-full mr-2"></span>
                          ) : (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          )}
                          {lesson.type} Lesson - {lesson.duration} minutes
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <CalendarIcon size={14} className="inline mr-1" />
                          {new Date(lesson.date).toLocaleDateString()} at {lesson.time}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <User size={14} className="inline mr-1" />
                          {lesson.instructor}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          <MapPin size={14} className="inline mr-1" />
                          {lesson.location}
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-500/30 text-blue-500 hover:bg-blue-950/20"
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
      <Dialog open={isLessonDetailsOpen} onOpenChange={setIsLessonDetailsOpen}>
        <DialogContent className="bg-secondary border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Lesson Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedLesson?.type} lesson information
            </DialogDescription>
          </DialogHeader>
          {selectedLesson && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="font-medium text-white">{selectedLesson.type} Lesson</h3>
                <p className="text-sm text-gray-400">Duration: {selectedLesson.duration} minutes</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-start">
                  <CalendarIcon className="mr-2 h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedLesson.date).toLocaleDateString()} at {selectedLesson.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="mr-2 h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-gray-400">{selectedLesson.instructor}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-2 h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-400">{selectedLesson.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsLessonDetailsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </PageLayout>
  );
};

export default Schedule;
