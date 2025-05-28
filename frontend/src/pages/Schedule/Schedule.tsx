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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    start_time: "2025-05-22T09:00:00Z",
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
    start_time: "2025-05-22T11:00:00Z",
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
const vehicleOptions = [
  { label: 'Toyota Corolla', value: 'toyota-corolla' },
  { label: 'Honda Civic', value: 'honda-civic' },
  { label: 'Ford Focus', value: 'ford-focus' },
  { label: 'Volkswagen Golf', value: 'volkswagen-golf' },
  { label: 'Volvo S60', value: 'volvo-s60' }
];

// Duration options
const durationOptions = [
  { label: '1 hour', value: '60' },
  { label: '1.5 hours', value: '90' },
  { label: '2 hours', value: '120' },
  { label: '3 hours', value: '180' }
];

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
  const [availablePracticalLessons, setAvailablePracticalLessons] = useState([]);
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
      fetchAvailablePracticalLessons(date);
    }
  }, [date, user?.role, isSubscribed]);

  // Mock function to fetch available practical lessons
  const fetchAvailablePracticalLessons = (selectedDate: Date) => {
    // In a real app, this would make an API call with the selected date
    console.log('Fetching available practical lessons for:', selectedDate.toISOString().split('T')[0]);
    
    // Filter mock data for the selected date
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const filteredLessons = mockAvailablePracticalLessons.filter(lesson => {
      const lessonDate = new Date(lesson.start_time).toISOString().split('T')[0];
      return lessonDate === selectedDateStr;
    });
    
    setAvailablePracticalLessons(filteredLessons);
  };

  const handleBookLesson = (slotId: number) => {
    setIsBooking(true);
    setSelectedSlot(slotId);

    setTimeout(() => {
      setIsBooking(false);
      setSelectedSlot(null);
      setAvailablePracticalLessons(prevLessons =>
        prevLessons.filter(lesson => lesson.id !== slotId)
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

  const handleAddAvailability = () => {
    // Format the date as YYYY-MM-DD
    const formattedDate = newAvailability.date.toISOString().split('T')[0];
    
    // Create a new availability slot
    const newSlot = {
      id: Date.now(), // generate a unique ID
      date: formattedDate,
      time: newAvailability.time,
      duration: parseInt(newAvailability.duration),
      type: newAvailability.type,
      title: newAvailability.title,
      instructor: user?.first_name || 'Instructor',
      location: newAvailability.location,
      vehicle: vehicleOptions.find(v => v.value === newAvailability.vehicle)?.label
    };
    
    // Since scheduleData.availableSlots doesn't exist, we create a new structure with the new slot
    const updatedScheduleData = {
      ...scheduleData,
      upcomingLessons: [...scheduleData.upcomingLessons]
    };
    
    setScheduleData(updatedScheduleData);
    
    // Close the dialog
    setIsAddAvailabilityOpen(false);
    
    // Show confirmation toast
    toast({
      title: 'Availability Added',
      description: 'Your new availability has been added to the schedule.',
    });
  };

  const handleManageScheduleClick = () => {
    navigate('/instructor/schedule');
  };

  // Removed the filterSlotsByDate function that was causing the error

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
                                {formatTime(lesson.start_time)}
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
                                disabled={isBooking && selectedSlot === lesson.id}
                                onClick={() => handleBookLesson(lesson.id)}
                              >
                                {isBooking && selectedSlot === lesson.id ? (
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
        
        {/* {user?.role === 'instructor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card className="bg-secondary border-gray-800">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Today's Lessons</div>
                    <div className="text-2xl font-bold">2</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">This Week</div>
                    <div className="text-2xl font-bold">8</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Available Slots</div>
                    <div className="text-2xl font-bold">4</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Completion Rate</div>
                    <div className="text-2xl font-bold">95%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-gray-800">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-lider-red hover:bg-red-700"
                    onClick={() => setIsAddAvailabilityOpen(true)}
                  >
                    <Plus size={16} className="mr-2" /> Add New Availability
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Clock size={16} className="mr-2" /> Manage Working Hours
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Check size={16} className="mr-2" /> Mark Lesson as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}
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

      {/* Add Availability Dialog */}
      {user?.role === 'instructor' && (
        <Dialog open={isAddAvailabilityOpen} onOpenChange={setIsAddAvailabilityOpen}>
          <DialogContent className="bg-secondary border-gray-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Availability</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new time slot when you're available to teach.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-2">
              {/* Event Title */}
              <div className="grid grid-cols-4 items-center gap-3 mb-3">
                <Label htmlFor="availability-title" className="text-right">
                  Event Title
                </Label>
                <div className="col-span-3">
                  <Input 
                    id="availability-title" 
                    placeholder="e.g., Evening practice session"
                    value={newAvailability.title}
                    onChange={(e) => setNewAvailability({...newAvailability, title: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              
              {/* Two column layout for compact form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {/* Date */}
                  <div className="mb-3">
                    <Label htmlFor="availability-date" className="block mb-1">
                      Date
                    </Label>
                    <Calendar
                      mode="single"
                      selected={newAvailability.date}
                      onSelect={(date) => date && setNewAvailability({...newAvailability, date})}
                      className="border border-gray-700 rounded-md p-2 w-full pointer-events-auto"
                      classNames={{
                        day_selected: "bg-lider-red text-white hover:bg-lider-red hover:text-white",
                        day_today: "bg-gray-800 text-white",
                        head_cell: "text-xs",
                        cell: "text-xs p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100"
                      }}
                    />
                  </div>
                  
                  {/* Time */}
                  <div className="mb-3">
                    <Label htmlFor="availability-time" className="block mb-1">
                      Time
                    </Label>
                    <Input 
                      id="availability-time" 
                      type="time" 
                      value={newAvailability.time}
                      onChange={(e) => setNewAvailability({...newAvailability, time: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                
                <div>
                  {/* Duration */}
                  <div className="mb-3">
                    <Label htmlFor="availability-duration" className="block mb-1">
                      Duration
                    </Label>
                    <Select 
                      value={newAvailability.duration}
                      onValueChange={(value) => setNewAvailability({...newAvailability, duration: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {durationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Lesson Type */}
                  <div className="mb-3">
                    <Label htmlFor="availability-type" className="block mb-1">
                      Lesson Type
                    </Label>
                    <Select 
                      value={newAvailability.type}
                      onValueChange={(value) => setNewAvailability({...newAvailability, type: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select lesson type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Practical">Practical</SelectItem>
                        <SelectItem value="Theory">Theory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Vehicle */}
              <div className="mb-3">
                <Label htmlFor="availability-vehicle" className="block mb-1">
                  Vehicle
                </Label>
                <Select 
                  value={newAvailability.vehicle}
                  onValueChange={(value) => setNewAvailability({...newAvailability, vehicle: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {vehicleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location */}
              <div className="mb-3">
                <Label htmlFor="availability-location" className="block mb-1">
                  Location
                </Label>
                <Input 
                  id="availability-location" 
                  value={newAvailability.location}
                  onChange={(e) => setNewAvailability({...newAvailability, location: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAvailabilityOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-lider-red hover:bg-red-700" onClick={handleAddAvailability}>
                Add Availability
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
};

export default Schedule;
