import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import { LessonDetailModal } from '@/components/schedule/LessonDetailModal';
import ukLocale from '@fullcalendar/core/locales/uk';
import { TeacherResource, fetchTeachers as fetchTeachersApi } from '@/utils/requests/teachers';
import { LessonEvent } from '@/types/scheduleInterface';
import { fecthEventsByTeacher } from '@/utils/requests/schedule/adminEvents';
import '@/styles/calendar.css';
import { Button } from '@/components/ui/button';

import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { CreateLessonModal } from '@/components/schedule/CreateLessonModal';
import PriotectedRoute from '@/components/layout/ProtectedRoute';
import { te } from 'date-fns/locale';
import { deleteTheoryLesson, deletePracticalLesson } from '@/utils/requests/schedule/lessons';

// Mock data for lessons
const MOCK_EVENTS = [
  {
    id: "t1",
    title: "Теорія - Група A1",
    start: "2025-05-20T10:00:00",
    end: "2025-05-20T11:00:00",
    type: "theory",
    group: "Група A1",
    is_online: false,
    location: "Головний офіс",
    resourceId: "5",
    instructor_id: 5
  },
  {
    id: "p1",
    title: "Практика - John Smith",
    start: "2025-05-20T10:30:00",
    end: "2025-05-20T11:30:00",
    type: "practical",
    student: "John Smith",
    car: "VW Polo AB1234CD",
    location: "Філія 2",
    resourceId: "6",
    instructor_id: 6
  },
  {
    id: "t2",
    title: "Теорія - Група B2",
    start: "2025-05-20T14:00:00",
    end: "2025-05-20T15:30:00",
    type: "theory",
    group: "Група B2",
    is_online: true,
    location: "Онлайн",
    resourceId: "7",
    instructor_id: 7
  },
  {
    id: "p2",
    title: "Практика - Anna Johnson",
    start: "2025-05-20T13:00:00",
    end: "2025-05-20T14:00:00",
    type: "practical",
    student: "Anna Johnson",
    car: "Toyota Corolla AA1234BX",
    location: "Головна філія",
    resourceId: "5",
    instructor_id: 5
  },
  {
    id: "t3",
    title: "Теорія - Група C3",
    start: "2025-05-20T10:00:00",
    end: "2025-05-20T11:30:00",
    type: "theory",
    group: "Група C3",
    is_online: false,
    location: "Філія 3",
    resourceId: "8",
    instructor_id: 8
  },
  {
    id: "p3",
    title: "Практика - Elena Smith",
    start: "2025-05-20T12:00:00",
    end: "2025-05-20T13:00:00",
    type: "practical",
    student: "Elena Smith",
    car: "Ford Focus BC5678VZ",
    location: "Філія 1",
    resourceId: "9",
    instructor_id: 9
  },
  // Add more events for the additional instructors
  {
    id: "p4",
    title: "Практика - Daniel Johnson",
    start: "2025-05-20T14:00:00",
    end: "2025-05-20T15:00:00",
    type: "practical",
    student: "Daniel Johnson",
    car: "Honda Civic KL3456MN",
    location: "Західна філія",
    resourceId: "10",
    instructor_id: 10
  },
  {
    id: "t4",
    title: "Теорія - Група D4",
    start: "2025-05-20T09:00:00",
    end: "2025-05-20T10:30:00",
    type: "theory",
    group: "Група D4",
    is_online: true,
    location: "Онлайн",
    resourceId: "11",
    instructor_id: 11
  },
  {
    id: "p5",
    title: "Практика - Lisa Wang",
    start: "2025-05-20T16:00:00",
    end: "2025-05-20T17:00:00",
    type: "practical",
    student: "Lisa Wang",
    car: "Škoda Octavia OP7890QR",
    location: "Північна філія",
    resourceId: "12",
    instructor_id: 12
  }
];

const AdminScheduleManagement = () => {
  const authState  = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lessonTypeFilter, setLessonTypeFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [resources, setResources] = useState<TeacherResource[]>([]);
  const [loading, setLoading] = useState(false);

  // Модальні вікна
  const [selectedLesson, setSelectedLesson] = useState<LessonEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Завантаження викладачів
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const teachers = await fetchTeachersApi();
        setResources(teachers);
        if (teachers && teachers.length > 0) {
          setInstructorFilter(teachers[0].id);
        }
      } catch (error) {
        setResources([]);
      }
    };
    fetchResources();
  }, []);

  // Завантаження подій при зміні інструктора
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      if (instructorFilter !== "all") {
        try {
          const fetchedEvents = await fecthEventsByTeacher(instructorFilter.toString());
          setEvents(fetchedEvents);
        } catch (error) {
          setEvents([]);
        } finally {
          setLoading(false);
        }
      } else {
        setEvents([]);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [instructorFilter]);

  // Фільтрація подій за типом
  const filteredEvents = events.filter(event => {
    return lessonTypeFilter === "all" || event.type === lessonTypeFilter;
  });

  // Обробка кліку по події
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const lesson = events.find(event => event.id.toString() === eventId.toString());
    if (lesson) {
      setSelectedLesson(lesson);
      setIsDetailModalOpen(true);
    }
  };

  // Обробка кліку по даті для створення заняття
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

  // Додавання заняття (аналогічно InstructorSchedule)
  const calculateEndTime = (startTime: string, duration: string): string =>  {
    const startDate = new Date(startTime);
    const [hours, minutes, seconds] = duration.split(':').map(Number);

    startDate.setHours(startDate.getHours() + (hours || 0));
    startDate.setMinutes(startDate.getMinutes() + (minutes || 0));
    startDate.setSeconds(startDate.getSeconds() + (seconds || 0));

    const pad = (n: number) => n.toString().padStart(2, '0');
    const endTime = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}T${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;

    return endTime;
  };

  const handleCreateTheoryLesson = (lessonData) => {
    const newLesson: LessonEvent = {
      id: lessonData.id,
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

  const handleCreatePracticalLesson = (lessonData) => {
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

  const handleUpdateTheoryLesson = (lessonData) => {
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
          : event
      )
    );
    toast({
      title: "Теоретичне заняття змінено",
      description: `Заняття заплановано на ${lessonData.time.split('T')[0]}`
    });
  };

  const handleUpdatePracticalLesson = (lessonData) => {
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
      description: `Заняття заплановано на ${lessonData.time.split('T')[0]}`
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


  const formatTeacherType = (type: string) => {
    switch (type) {
      case 'theory':
        return 'Теорія';
      case 'practical':
        return 'Практика';
      case 'theory_practice':
        return 'Теорія та практика';
      default:
        return '';
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
    <PageLayout>
      <PriotectedRoute allowedRoles={['admin']}>
      <PageHeader 
        title="Керування розкладом" 
        subtitle="Переглядайте всі заплановані заняття"
      />
      <div className="container-custom py-8">
        <Card className="bg-secondary border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Тип заняття
                </label>
                <Select
                  value={lessonTypeFilter}
                  onValueChange={setLessonTypeFilter}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Оберіть тип заняття" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Всі заняття</SelectItem>
                    <SelectItem value="theory">Теоретичні заняття</SelectItem>
                    <SelectItem value="practical">Практичні заняття</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Викладач
                </label>
                <Select
                  value={instructorFilter}
                  onValueChange={setInstructorFilter}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Оберіть інструктора" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">                   
                    {resources.map(resource => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name} ({formatTeacherType(resource.type)}) 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-gray-800">
          <CardContent className="p-0">
            <div className="calendar">
              {/* <div className="flex flex-wrap gap-4 p-4 border-b border-gray-700 justify-between">
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
              </div> */}
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
                  allDaySlot={false}
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
                  locale="uk"
                  locales={[ukLocale]}
                />     

              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Lesson detail modal */}
      <LessonDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lesson={selectedLesson}
        canEdit={true}
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
        isAdmin={true}
        instructor={resources.find(r => r.id.toString() === instructorFilter.toString()) }
      />
    </PriotectedRoute>  
    </PageLayout>
  );
};

export default AdminScheduleManagement;
