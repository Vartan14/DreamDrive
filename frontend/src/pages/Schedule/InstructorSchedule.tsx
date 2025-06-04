import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTeacherEvents } from '@/utils/requests/schedule/teacherEvents';
import { 
  deleteTheoryLesson,
  deletePracticalLesson,
  updateTheoryLesson,
  updatePracticalLesson 
} from '@/utils/requests/schedule/lessons';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';

import { LessonDetailModal } from '@/components/schedule/LessonDetailModal';
import { CreateLessonModal } from '@/components/schedule/CreateLessonModal';
import { LessonEvent, CreateTheoryLessonData, CreatePracticalLessonData, PracticalLesson, TheoryLesson } from '@/types/scheduleInterface';
import { co } from 'node_modules/@fullcalendar/core/internal-common';
import Lessons from '../Deprecated/Lessons';
import ukLocale from '@fullcalendar/core/locales/uk';
import { formatEventDate, formatEventTime } from '@/utils/formatDate';
import '@/styles/calendar.css';

const InstructorSchedule = () => {
  //const navigate = useNavigate();
  const authState  = useAuthStore();
  const { toast } = useToast();
  const user = authState.user;

  const [activeTab, setActiveTab] = useState("calendar");
  const [lessonTypeFilter, setLessonTypeFilter] = useState("all");
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // State for modals
  const [selectedLesson, setSelectedLesson] = useState<LessonEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getTeacherEvents();
        setEvents(data);
      } catch (e) {
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити заняття.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on selected lesson type
  const filteredEvents = events.filter(event => {
    if (lessonTypeFilter === 'all') return true;
    return event.type === lessonTypeFilter;
  });

  // Calculate upcoming lessons (starting from current date and time)
  const upcomingLessons = filteredEvents
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Handle click on event
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const lesson = events.find(event => event.id.toString() === eventId.toString());
    
    if (lesson) {
      setSelectedLesson(lesson);
      setIsDetailModalOpen(true);
    }
  };


  const handleDateClick = (info: any) => {
    if (info.date < new Date(new Date().setSeconds(0, 0))) {
      toast({
        title: "Оберіть іншу дату",
        description: "Неможливо додати заняття на цю дату.",
        duration: 1000
      });
      return;
    }
    const [datePart, timePart] = info.dateStr.split('T');
    const [hours, minutes] = timePart.split(':');
    const selected = new Date(
      Number(datePart.split('-')[0]),
      Number(datePart.split('-')[1]) - 1,
      Number(datePart.split('-')[2]),
      Number(hours),
      Number(minutes)
    );
    setSelectedDate(selected);
    setIsCreateModalOpen(true);
  };
  

  const canEditLesson = (lesson: LessonEvent | null): boolean =>   {
    if (!lesson) return false;

    const now = new Date();
    const start = new Date(lesson.start);
    const diffMs = start.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) return false;

    return (
      lesson.type === 'theory' ||
      (lesson.type === 'practical' && lesson.status === 'available')
    );
  }

  const handleCreateLessonClick = () => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 0, 0, 0); // наступний день, 07:00
    setSelectedDate(nextDay);
    setIsCreateModalOpen(true);
  };

  const calculateEndTime = (startTime: string, duration: string): string =>  {
    const startDate = new Date(startTime);
    const [hours, minutes, seconds] = duration.split(':').map(Number);

    startDate.setHours(startDate.getHours() + (hours || 0));
    startDate.setMinutes(startDate.getMinutes() + (minutes || 0));
    startDate.setSeconds(startDate.getSeconds() + (seconds || 0));

    const pad = (n: number) => n.toString().padStart(2, '0');
    const endTime = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}T${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;

    return endTime;
  }



  const handleCreateTheoryLesson = (lessonData: CreateTheoryLessonData) => {

    const newLesson: LessonEvent = {
      id:  lessonData.id,
      title: `${lessonData.lesson_title || 'Теоретичне заняття'}\n${lessonData.group.name}`,
      start: lessonData.time,
      end: calculateEndTime(lessonData.time, lessonData.duration),
      duration: lessonData.duration,
      type: 'theory',
      group_id: lessonData.group.id,
      group: lessonData.group.name,
      is_online: lessonData.is_online,
      filial_id: lessonData.filial_id,
    };
    
    setEvents([...events, newLesson]);
    
    toast({
      title: "Теоретичне заняття додано",
      description: `Заняття заплановано на ${lessonData.time.split('T')[0]}`
    });
  };

  const handleCreatePracticalLesson = (lessonData: CreatePracticalLessonData) => {

    const newLesson: LessonEvent = {
      id: lessonData.id,
      title: `${lessonData.lesson_title || 'Практичне заняття'}\nДоступно до бронювання`,
      start: lessonData.time,
      end: calculateEndTime(lessonData.time, lessonData.duration),
      duration: lessonData.duration,
      type: 'practical',
      car: lessonData.car,
      location: lessonData.location,
      filial_id: lessonData.filial_id,
    };
    
    setEvents([...events, newLesson]);
    
    toast({
      title: "Практичне заняття створено",
      description: `Практичне заняття заплановано на ${lessonData.time.split('T')[0]}`
    });
  };


  const handleUpdateTheoryLesson = async (lessonData: CreateTheoryLessonData) => {
    const id = lessonData.id;

    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id.toString() === id.toString()
          ? {
              ...event,
              title: `${lessonData.lesson_title || 'Теоретичне заняття'}\n${lessonData.group.name}`,
              start: lessonData.time,
              end: calculateEndTime(lessonData.time, lessonData.duration),
              duration: lessonData.duration,
              group_id: lessonData.group.id,
              group: lessonData.group.name,
              is_online: lessonData.is_online,
              filial_id: lessonData.filial_id,
              isEdited: true, 
            }
          : event as LessonEvent
      )
    );

    toast({
      title: "Теоретичне заняття змінено",
      description: `Заняття заплановано на ${lessonData.time.split('T')[0]}`
    });
  };

  const handleUpdatePracticalLesson = async (lessonData: CreatePracticalLessonData) => {
    const id = lessonData.id;
    setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id.toString() === id.toString()
              ? {
                  ...event,
                  title: `${lessonData.lesson_title || 'Практичне заняття'}\nДоступно до бронювання`,
                  start: lessonData.time,
                  end: calculateEndTime(lessonData.time, lessonData.duration),
                  duration: lessonData.duration,
                  type: 'practical',
                  car: lessonData.car,
                  location: lessonData.location,
                  isEdited: true, 
                }
              : event
          )
        );

    toast({
      title: "Практичне заняття змінено",
      description: `Заняття заплановано на ${lessonData.time.split('T')[0]} `
    });
  };

  const handleEditLesson = () => {
    setEditingLesson(selectedLesson);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    console.log("Deleting lesson:", selectedLesson);

    try {
      if (selectedLesson.type === 'theory') {
        await deleteTheoryLesson(Number(selectedLesson.id));
      } else if (selectedLesson.type === 'practical') {
        await deletePracticalLesson(Number(selectedLesson.id));
      } else
      {
        console.error("Unknown lesson type:", selectedLesson);
        throw new Error("Unknown lesson type");
      }

      setEvents(events =>
        events.map(e =>
          e.id === selectedLesson.id
            ? { ...e, status: 'cancelled' }
            : e
        )
      );
      setIsDetailModalOpen(false);

      toast({
        title: "Заняття відмінено",
        description: `${selectedLesson.type === 'theory' ? 'Теоретичне' : 'Практичне'} заняття було відмінено.`
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося відмінити заняття.",
        variant: "destructive"
      });
    }
  };


  if (authState.isLoading || loading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <PageLayout>
        <PageHeader 
          title="Розклад викладача" 
          subtitle="Керуйте своїм навчальним розкладом та доступністю"
        />
        
        <div className="container-custom py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="calendar">Розклад</TabsTrigger>
              <TabsTrigger value="upcoming">Мої заняття</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="mt-6">
              <Card className="bg-secondary border-gray-800">
                <CardContent className="p-0">
                  {/* Filters Row */}
                  <div className="flex flex-wrap gap-4 p-4 border-b border-gray-700 justify-between">
                    <div className="flex flex-col w-40">
                      <span className="text-sm text-gray-400 mb-1">Тип заняття</span>
                      <Select value={lessonTypeFilter} onValueChange={setLessonTypeFilter}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Оберіть тип заняття" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all">Всі заняття</SelectItem>
                          <SelectItem value="theory">Теорія</SelectItem>
                          <SelectItem value="practical">Практика</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* <Button 
                      className="bg-lider-red hover:bg-red-700"
                      onClick={handleCreateLessonClick}
                    >
                      <Plus size={16} className="mr-2" />
                      Додати заняття
                    </Button> */}
                  </div>
                  
                  {/* Calendar */}
                  <div className="p-4 calendar-container">
                                   
                    <FullCalendar 
                      timeZone="Europe/Kyiv"
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                      }}
                      slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false 
                      }}
                      eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }}
                      events={filteredEvents}
                      slotMinTime="07:00:00"
                      slotMaxTime="19:00:00"
                      nowIndicator={true}
                      eventClick={handleEventClick}
                      dateClick={handleDateClick}
                      eventClassNames={(info) => {
                      const eventData = filteredEvents.find(e => e.id.toString() === info.event.id.toString());
                      if (eventData.status === 'cancelled') {
                        return 'cancelled-event';
                      }
                      if (eventData?.type === 'theory') {
                        return 'theory-event';
                      }
                      else if (eventData?.type === 'practical') {
                        if (eventData.status === 'booked') {
                          return 'practical-booked-event';  
                        }
                        else {
                          return 'practical-available-event';  
                        }
                      }
                      }}
                      height="100%"
                      allDaySlot={false}
                      locale="uk"
                      locales={[ukLocale]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-6">
              <Card className="bg-secondary border-gray-800">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Майбутні заняття</h2>
                  
                  {upcomingLessons.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingLessons.map(lesson => (
                        <Card 
                          key={lesson.id} 
                          className="bg-gray-800/30 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-800/50"
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-grow">
                                <div className="flex items-center">
                                  {lesson.type === 'theory' ? (
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                  ) : (
                                    <div
                                      className={
                                        "w-3 h-3 rounded-full mr-3 " +
                                        (lesson.status === 'booked'
                                          ? "bg-orange-500"
                                          : lesson.status === 'completed' || lesson.status === 'cancelled'
                                            ? "bg-red-500"
                                            : "bg-green-500")
                                      }
                                    ></div>
                                  )}
                                  <div>
                                    <h3 className="font-medium">
                                      {lesson.type === 'theory' ? 'Теоретичне заняття' : 'Практичне заняття'} 
                                      { lesson.lesson_title !== '' ? `: ${lesson.lesson_title}` : '' } 
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                      {formatEventDate(lesson.start)} • {formatEventTime(lesson.start)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-3 text-sm">
                                  {lesson.type === 'theory' ? (
                                    <>
                                      <p>{lesson.group}</p>
                                      <p className="text-gray-400">
                                        {lesson.location}{lesson.is_online ? 'Онлайн' : 'Офлайн'}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p>{
                                        lesson.status === 'available' ? 'Доступно до бронювання'
                                        : lesson.status === 'booked' ? 'Заброньовано'
                                        : lesson.status === 'completed' ? 'Завершено'
                                        : lesson.status === 'cancelled' ? 'Скасовано'
                                        : '—'
                                      }</p>
                                      {lesson.status === 'booked' && (
                                        <p>{lesson.student}</p>
                                      )}
                                      <p className="text-gray-400">
                                        {lesson.location} • {lesson.car}
                                      </p>
                                    </>
                                  )}
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <p className="mb-2">Немає майбутніх занять</p>
                      <Button 
                        className="bg-lider-red hover:bg-red-700 mt-2"
                        onClick={() => {
                          setActiveTab("calendar");
                          handleCreateLessonClick();
                          //setIsCreateModalOpen(true);
                        }}
                      >
                        Додати нове заняття
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Lesson detail modal */}
        <LessonDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          lesson={selectedLesson}
          canEdit={canEditLesson(selectedLesson)}
          onDelete={handleDeleteLesson}
          onEdit={handleEditLesson}         
        />
        
        <CreateLessonModal
          isOpen={isCreateModalOpen || isEditModalOpen}
           onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setEditingLesson(null);
          }}
          selectedDate={selectedDate}
          onCreateTheoryLesson={handleCreateTheoryLesson}
          onCreatePracticalLesson={handleCreatePracticalLesson}
          onUpdateTheoryLesson={handleUpdateTheoryLesson}
          onUpdatePracticalLesson={handleUpdatePracticalLesson}  
          useCompactDatePicker={true}
          lessonToEdit={editingLesson}
          events={events}
        />
      </PageLayout>
    </ProtectedRoute>  
  );
};

export default InstructorSchedule;
