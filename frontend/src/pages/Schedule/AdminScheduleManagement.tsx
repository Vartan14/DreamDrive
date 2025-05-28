import React, { useState } from 'react';
import { useAuth } from '@/pages/Auth/OLD_AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';

// Custom components
import { LessonDetailModal } from '@/components/schedule/LessonDetailModal';

// Mock data for instructors (resources)
const MOCK_RESOURCES = [
  { id: "5", title: "Olena K." },
  { id: "6", title: "Ivan M." },
  { id: "7", title: "Sergiy T." },
  { id: "8", title: "Maria Rodriguez" },
  { id: "9", title: "Robert Chen" },
  { id: "10", title: "David Wilson" },
  { id: "11", title: "James Johnson" },
  { id: "12", title: "Samantha Lee" },
  { id: "13", title: "Thomas Brown" },
  { id: "14", title: "Elizabeth Davis" },
  { id: "15", title: "Michael Garcia" },
  { id: "16", title: "Emma Wilson" },
  { id: "17", title: "Noah Martinez" },
  { id: "18", title: "Olivia Taylor" },
  { id: "19", title: "William Johnson" },
  { id: "20", title: "Sofia Garcia" }
];

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
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [lessonTypeFilter, setLessonTypeFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [resources, setResources] = useState(MOCK_RESOURCES);
  
  // Modal state
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Redirect to login if not authenticated or not an admin
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    const matchesType = lessonTypeFilter === "all" || event.type === lessonTypeFilter;
    const matchesInstructor = instructorFilter === "all" || event.resourceId === instructorFilter;
    return matchesType && matchesInstructor;
  });

  // Handle event click
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const lesson = events.find(event => event.id === eventId);
    
    if (lesson) {
      setSelectedLesson(lesson);
      setIsDetailModalOpen(true);
    }
  };

  // Filter resources based on instructor filter
  const filteredResources = instructorFilter === "all" 
    ? resources 
    : resources.filter(resource => resource.id === instructorFilter);

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!authState.user || authState.user.role !== 'admin') {
    return null; // Will redirect to login
  }

  return (
    <PageLayout>
      <PageHeader 
        title="Керування розкладом" 
        subtitle="Переглядайте всі заплановані заняття по філіях та інструкторах"
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
                  Інструктор
                </label>
                <Select
                  value={instructorFilter}
                  onValueChange={setInstructorFilter}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Оберіть інструктора" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Всі інструктори</SelectItem>
                    {resources.map(resource => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.title}
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
            <div className="calendar-container">
              <style>
                {`
                .calendar-container {
                  /* Збільшено висоту календаря як у InstructorSchedule */
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
                .fc-resource-timeline-divider {
                  background-color: #374151 !important;
                }
                .fc-timegrid-body {
                  overflow-x: auto;
                }
                .fc-timeGridDay-button {
                  display: none !important;
                }
                .fc-timegrid-axis-cushion.fc-scrollgrid-shrink-cushion,
                .fc-timegrid-axis-frame.fc-scrollgrid-shrink,
                .fc-scrollgrid-sync-inner.fc-timegrid-axis {
                  display: none;
                }
                .fc .fc-timegrid-slots {
                  border-top: 0;
                }
                .fc-toolbar-chunk:nth-child(2) {
                  display: flex;
                  justify-content: center;
                  flex-grow: 1;
                }
                .fc .fc-toolbar-title {
                  text-align: center;
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
                initialView="timeGridDay"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                events={filteredEvents}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                nowIndicator={true}
                eventClick={handleEventClick}
                eventClassNames={(info) => {
                  const eventData = events.find(e => e.id === info.event.id);
                  return eventData?.type === 'theory' ? 'theory-event' : 'practical-event';
                }}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <LessonDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lesson={selectedLesson}
        canEdit={false}
      />
    </PageLayout>
  );
};

export default AdminScheduleManagement;
