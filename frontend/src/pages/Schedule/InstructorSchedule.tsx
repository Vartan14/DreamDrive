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

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';

// Custom components
import { LessonDetailModal } from '@/components/schedule/LessonDetailModal';
import { CreateLessonModal } from '@/components/schedule/CreateLessonModal';
import { LessonEvent, CreateTheoryLessonData, CreatePracticalLessonData } from '@/types/schedule';

// Mock data for instructor's schedule
const MOCK_EVENTS: LessonEvent[] = [
  {
    id: "t1",
    title: "Теоретичне заняття - Група A1",
    start: "2025-05-22T10:00:00",
    end: "2025-05-22T11:00:00",
    type: "theory",
    group: "Група A1",
    is_online: false,
    location: "Головний офіс, ауд. 3",
    instructor_id: 5
  },
  {
    id: "p1",
    title: "Практичне заняття - John Smith",
    start: "2025-05-23T14:00:00",
    end: "2025-05-21T15:00:00",
    type: "practical",
    student: "John Smith",
    car: "Ford Fiesta AB5678CD",
    location: "Філія 1",
    instructor_id: 5
  }
];

const InstructorSchedule = () => {
  const navigate = useNavigate();
  const authState  = useAuthStore();
  const { toast } = useToast();
  const user = authState.user;
  
  // State for tabs
  const [activeTab, setActiveTab] = useState("calendar");
  
  // State for filters
  const [lessonTypeFilter, setLessonTypeFilter] = useState("all");
  
  // State for events
  const [events, setEvents] = useState<LessonEvent[]>(MOCK_EVENTS);
  
  // State for modals
  const [selectedLesson, setSelectedLesson] = useState<LessonEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  

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
    const lesson = events.find(event => event.id === eventId);
    
    if (lesson) {
      setSelectedLesson(lesson);
      setIsDetailModalOpen(true);
    }
  };

  // Handle click on date/time slot
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };
  
  // Handle create new lesson button click
  const handleCreateLessonClick = () => {
    setSelectedDate(new Date());
    setIsCreateModalOpen(true);
  };

  // Handle create theory lesson
  const handleCreateTheoryLesson = (lessonData: CreateTheoryLessonData) => {
    const startDateTime = new Date(lessonData.date);
    const [hours, minutes] = lessonData.time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0);
    
    const durationInMinutes = parseInt(lessonData.duration);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);
    
    const newLesson: LessonEvent = {
      id: `t${Date.now()}`,
      title: `Теорія - ${lessonData.title}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: 'theory',
      group: `Група ${lessonData.group_id}`,
      is_online: lessonData.is_online,
      location: `Філія ${lessonData.filial_id}`,
      instructor_id: user?.user_id || 0
    };
    
    setEvents([...events, newLesson]);
    
    toast({
      title: "Теоретичне заняття створено",
      description: `Теорія запланована на ${startDateTime.toLocaleString()}`
    });
  };

  // Handle create practical lesson
  const handleCreatePracticalLesson = (lessonData: CreatePracticalLessonData) => {
    const startDateTime = new Date(lessonData.date);
    const [hours, minutes] = lessonData.time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0);
    
    const durationInMinutes = parseInt(lessonData.duration);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);
    
    const newLesson: LessonEvent = {
      id: `p${Date.now()}`,
      title: `Практика - Вільно`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: 'practical',
      car: lessonData.car,
      location: lessonData.location,
      instructor_id: user?.user_id || 0
    };
    
    setEvents([...events, newLesson]);
    
    toast({
      title: "Практичне заняття створено",
      description: `Практика запланована на ${startDateTime.toLocaleString()}`
    });
  };

  // Handle delete lesson
  const handleDeleteLesson = () => {
    if (!selectedLesson) return;
    
    setEvents(events.filter(event => event.id !== selectedLesson.id));
    setIsDetailModalOpen(false);
    
    toast({
      title: "Заняття видалено",
      description: `${selectedLesson.type === 'theory' ? 'Теоретичне' : 'Практичне'} заняття було видалено.`
    });
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (authState.isLoading) {
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
          title="Розклад інструктора" 
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
                    
                    <Button 
                      className="bg-lider-red hover:bg-red-700"
                      onClick={handleCreateLessonClick}
                    >
                      <Plus size={16} className="mr-2" />
                      Додати заняття
                    </Button>
                  </div>
                  
                  {/* Calendar */}
                  <div className="p-4 calendar-container">
                    <style>
                      {`
                      .calendar-container {
                        /* Збільшено висоту календаря */
                        height: calc(80vh - 200px);
                        min-height: 500px;
                      }
                      .calendar-container .fc {
                        height: 100%;
                      }
                      .theory-event {
                        background-color: rgba(37, 99, 235, 0.15);
                        border-color: rgba(37, 99, 235, 0.5);
                        color: #e2e8f0;
                      }
                      .practical-event {
                        background-color: rgba(5, 150, 105, 0.15);
                        border-color: rgba(5, 150, 105, 0.5);
                        color: #e2e8f0;
                      }
                      .fc-timegrid-event-harness {
                        margin-left: 2px !important;
                        margin-right: 2px !important;
                      }
                      .fc .fc-button-primary {
                        background-color: #1f2937;
                        border-color: #374151;
                        color: #e5e7eb;
                      }
                      .fc .fc-button-primary:hover {
                        background-color: #374151;
                      }
                      .fc .fc-button-primary:disabled {
                        background-color: #1f2937;
                        opacity: 0.7;
                      }
                      .fc .fc-button-primary:not(:disabled).fc-button-active, 
                      .fc .fc-button-primary:not(:disabled):active {
                        background-color: #ea384c;
                        border-color: #ea384c;
                      }
                      .fc-theme-standard .fc-scrollgrid {
                        border-color: #374151;
                      }
                      .fc-theme-standard td, .fc-theme-standard th {
                        border-color: #374151;
                      }
                      .fc .fc-daygrid-day.fc-day-today,
                      .fc .fc-timegrid-col.fc-day-today {
                        background-color: rgba(234, 56, 76, 0.1);
                      }
                      .fc-col-header-cell {
                        background-color: #1f2937;
                      }
                      .fc-timegrid-slot, .fc-timegrid-axis {
                        height: 48px !important;
                      }
                      .fc-timegrid-axis-cushion.fc-scrollgrid-shrink-cushion,
                      .fc-timegrid-axis-frame.fc-scrollgrid-shrink,
                      .fc-scrollgrid-sync-inner.fc-timegrid-axis {
                        display: none;
                      }
                      .fc .fc-timegrid-slots {
                        border-top: 0;
                      }
                      @media (max-width: 640px) {
                        .calendar-container {
                          height: calc(90vh - 180px);
                          min-height: 400px;
                        }
                        .fc-toolbar.fc-header-toolbar {
                          flex-direction: column;
                          gap: 0.5rem;
                        }
                        .fc .fc-toolbar-title {
                          font-size: 1.2rem;
                        }
                        .fc-header-toolbar .fc-toolbar-chunk {
                          display: flex;
                          justify-content: center;
                        }
                        .fc-timeGridWeek-button {
                          display: none !important;
                        }
                      }
                      `}
                    </style>
                    
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                      }}
                      events={filteredEvents}
                      slotMinTime="08:00:00"
                      slotMaxTime="20:00:00"
                      nowIndicator={true}
                      eventClick={handleEventClick}
                      dateClick={handleDateClick}
                      eventClassNames={(info) => {
                        const eventData = events.find(e => e.id === info.event.id);
                        return eventData?.type === 'theory' ? 'theory-event' : 'practical-event';
                      }}
                      height="100%"
                      allDaySlot={false}
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
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                                  )}
                                  <div>
                                    <h3 className="font-medium">
                                      {lesson.type === 'theory' ? 'Теоретичне заняття' : 'Практичне заняття'}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                      {formatEventDate(lesson.start)} • {formatEventTime(lesson.start)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-3 text-sm">
                                  {lesson.type === 'theory' ? (
                                    <>
                                      <p>Група: {lesson.group}</p>
                                      <p className="text-gray-400">
                                        {lesson.location} • {lesson.is_online ? 'Онлайн' : 'Очно'}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p>Студент: {lesson.student || 'Вільно'}</p>
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
                          setIsCreateModalOpen(true);
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
          canEdit={true}
          onDelete={handleDeleteLesson}
          onEdit={() => {
            toast({
              title: "Редагування",
              description: "Редагування занять поки не реалізовано."
            });
          }}
        />
        
        {/* Create lesson modal with compact date selector */}
        <CreateLessonModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          selectedDate={selectedDate}
          onCreateTheoryLesson={handleCreateTheoryLesson}
          onCreatePracticalLesson={handleCreatePracticalLesson}
          useCompactDatePicker={true}
        />
      </PageLayout>
    </ProtectedRoute>  
  );
};

export default InstructorSchedule;
