
import React, { useState } from 'react';
import { useAuth } from '@/pages/Auth/OLD_AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, MapPin, Clock, Users, User, Check, Car, Bike, Truck } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';

// Mock data for available lessons
const mockAvailableLessons = [
  {
    id: '1',
    date: '2025-05-02',
    time: '09:00',
    duration: 90,
    instructor: 'Michael Johnson',
    category: 'B',
    location: 'Central Branch',
    spotsTotal: 5,
    spotsAvailable: 3,
    type: 'Practical',
    topic: 'City Driving'
  },
  {
    id: '2',
    date: '2025-05-02',
    time: '11:00',
    duration: 60,
    instructor: 'Sarah Williams',
    category: 'A1',
    location: 'North Branch',
    spotsTotal: 4,
    spotsAvailable: 2,
    type: 'Practical',
    topic: 'Basic Motorcycle Control'
  },
  {
    id: '3',
    date: '2025-05-03',
    time: '10:00',
    duration: 120,
    instructor: 'Robert Brown',
    category: 'C',
    location: 'South Branch',
    spotsTotal: 3,
    spotsAvailable: 1,
    type: 'Practical',
    topic: 'Truck Maneuvering'
  },
  {
    id: '4',
    date: '2025-05-04',
    time: '14:00',
    duration: 90,
    instructor: 'Michael Johnson',
    category: 'B',
    location: 'Central Branch',
    spotsTotal: 5,
    spotsAvailable: 4,
    type: 'Practical',
    topic: 'Parallel Parking'
  },
  {
    id: '5',
    date: '2025-05-04',
    time: '18:00',
    duration: 120,
    instructor: 'Emma Davis',
    category: 'B',
    location: 'West Branch',
    spotsTotal: 5,
    spotsAvailable: 2,
    type: 'Theory',
    topic: 'Traffic Rules and Regulations'
  },
  {
    id: '6',
    date: '2025-05-05',
    time: '09:30',
    duration: 60,
    instructor: 'Sarah Williams',
    category: 'A',
    location: 'East Branch',
    spotsTotal: 4,
    spotsAvailable: 3,
    type: 'Theory',
    topic: 'Motorcycle Safety'
  }
];

// Mock data for user's booked lessons
const mockUserBookings = [
  {
    id: '101',
    date: '2025-05-10',
    time: '15:00',
    duration: 90,
    instructor: 'Michael Johnson',
    category: 'B',
    location: 'Central Branch',
    status: 'upcoming',
    type: 'Practical',
    topic: 'Highway Driving',
    notes: 'Bring your ID and wear comfortable shoes'
  },
  {
    id: '102',
    date: '2025-05-15',
    time: '11:30',
    duration: 60,
    instructor: 'Emma Davis',
    category: 'B',
    location: 'West Branch',
    status: 'upcoming',
    type: 'Practical',
    topic: 'Defensive Driving',
    notes: ''
  },
  {
    id: '103',
    date: '2025-04-20',
    time: '10:00',
    duration: 90,
    instructor: 'Robert Brown',
    category: 'B',
    location: 'South Branch',
    status: 'completed',
    type: 'Practical',
    topic: 'Basic Vehicle Control',
    performance: 'Good progress with steering and braking. Needs more practice with mirror usage.'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'A':
    case 'A1':
      return <Bike size={16} />;
    case 'B':
      return <Car size={16} />;
    case 'C':
      return <Truck size={16} />;
    default:
      return <Car size={16} />;
  }
};

const Lessons = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('available');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // For instructor lesson management
  const isInstructor = authState.user?.role === 'instructor' || authState.user?.role === 'admin';
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate]);
  
  // Filter available lessons based on selected date and filters
  const filteredLessons = mockAvailableLessons.filter(lesson => {
    // Always filter by date
    if (date && format(date, 'yyyy-MM-dd') !== lesson.date) return false;
    
    // Apply additional filters if selected
    if (selectedType && lesson.type !== selectedType) return false;
    if (selectedCategory && lesson.category !== selectedCategory) return false;
    if (selectedLocation && lesson.location !== selectedLocation) return false;
    
    return true;
  });
  
  // Get unique values for filters
  const uniqueTypes = [...new Set(mockAvailableLessons.map(l => l.type))];
  const uniqueCategories = [...new Set(mockAvailableLessons.map(l => l.category))];
  const uniqueLocations = [...new Set(mockAvailableLessons.map(l => l.location))];
  
  // Separate upcoming and past bookings
  const upcomingBookings = mockUserBookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = mockUserBookings.filter(booking => booking.status === 'completed');
  
  // Handle booking a lesson
  const handleBookLesson = (lessonId: string) => {
    toast({
      title: "Lesson Booked",
      description: "You have successfully booked this lesson.",
    });
    // In a real app, you would call an API to book the lesson
  };
  
  // Handle canceling a booking
  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Canceled",
      description: "Your lesson booking has been canceled.",
    });
    // In a real app, you would call an API to cancel the booking
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
  
  return (
    <PageLayout>
      <div className="container-custom py-12">
        {/* Header */}
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              {isInstructor ? "Lesson Management" : "Book Your Lessons"}
            </h1>
            <p className="text-gray-400">
              {isInstructor 
                ? "Schedule and manage driving lessons for your students" 
                : "Find and book your next driving lesson with our experienced instructors"}
            </p>
          </CardContent>
        </Card>
        
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="available" className="data-[state=active]:bg-lider-red">
              {isInstructor ? "Lesson Schedule" : "Available Lessons"}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-lider-red">
              {isInstructor ? "My Classes" : "My Bookings"}
            </TabsTrigger>
            {isInstructor && (
              <TabsTrigger value="manage" className="data-[state=active]:bg-lider-red">
                Create Lessons
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            {/* Calendar and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays size={18} className="mr-2 text-lider-red" />
                    Select Date
                  </CardTitle>
                  <CardDescription>
                    Choose a date to see available lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => day && setDate(day)}
                    className="rounded-md border border-gray-700 bg-gray-900"
                  />
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>
                    Narrow down available lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Lesson Type</label>
                    <Select value={selectedType || ""} onValueChange={(value) => setSelectedType(value || null)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="">All Types</SelectItem>
                        {uniqueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">License Category</label>
                    <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="">All Categories</SelectItem>
                        {uniqueCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center">
                              {getCategoryIcon(category)}
                              <span className="ml-2">Category {category}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <Select value={selectedLocation || ""} onValueChange={(value) => setSelectedLocation(value || null)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="">All Locations</SelectItem>
                        {uniqueLocations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setSelectedType(null);
                      setSelectedCategory(null);
                      setSelectedLocation(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle>Selected Date</CardTitle>
                  <CardDescription>
                    {date ? format(date, 'EEEE, MMMM do yyyy') : 'No date selected'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="mb-2">
                      <span className="font-medium">Available Lessons:</span> {filteredLessons.length}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {uniqueTypes.map(type => {
                        const count = filteredLessons.filter(l => l.type === type).length;
                        return count > 0 ? (
                          <Badge key={type} variant="outline" className="border-gray-600">
                            {type}: {count}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {uniqueCategories.map(category => {
                        const count = filteredLessons.filter(l => l.category === category).length;
                        return count > 0 ? (
                          <Badge key={category} variant="outline" className="border-gray-600">
                            Cat {category}: {count}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Available Lessons */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Available Lessons</h2>
            
            {filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredLessons.map(lesson => (
                  <Card key={lesson.id} className="bg-secondary border-gray-800 hover:border-lider-red/50 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{lesson.topic}</CardTitle>
                          <CardDescription>
                            {lesson.type} - Category {lesson.category}
                          </CardDescription>
                        </div>
                        
                        <Badge className={`${
                          lesson.type === 'Practical' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                          {lesson.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-2">
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center text-gray-400">
                          <Clock size={16} className="mr-2 text-lider-red" />
                          <span>{lesson.time} ({lesson.duration} min)</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <CalendarDays size={16} className="mr-2 text-lider-red" />
                          <span>{format(new Date(lesson.date), 'MMM d')}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <MapPin size={16} className="mr-2 text-lider-red" />
                          <span>{lesson.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <Users size={16} className="mr-2 text-lider-red" />
                          <span>{lesson.spotsAvailable}/{lesson.spotsTotal} spots available</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                        <User size={16} className="mr-2 text-lider-red" />
                        <div>
                          <div className="font-medium">{lesson.instructor}</div>
                          <div className="text-xs text-gray-400">Instructor</div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      {isInstructor ? (
                        <Button className="w-full">Manage Lesson</Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-lider-red hover:bg-red-700"
                              disabled={lesson.spotsAvailable === 0}
                            >
                              {lesson.spotsAvailable > 0 ? 'Book This Lesson' : 'Fully Booked'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle>Book Lesson</DialogTitle>
                              <DialogDescription>
                                Confirm your booking for this lesson.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <h3 className="font-medium text-lg">{lesson.topic}</h3>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-2 text-lider-red" />
                                  <span>{lesson.time} ({lesson.duration} min)</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <CalendarDays size={16} className="mr-2 text-lider-red" />
                                  <span>{format(new Date(lesson.date), 'EEEE, MMM d')}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <MapPin size={16} className="mr-2 text-lider-red" />
                                  <span>{lesson.location}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <User size={16} className="mr-2 text-lider-red" />
                                  <span>{lesson.instructor}</span>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                                <p>By booking this lesson, you agree to arrive 10 minutes before the start time. Cancellations must be made at least 24 hours in advance.</p>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {}}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-lider-red hover:bg-red-700"
                                onClick={() => handleBookLesson(lesson.id)}
                              >
                                Confirm Booking
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-secondary border-gray-800">
                <CardContent className="py-16 text-center">
                  <h3 className="text-xl font-medium mb-2">No Lessons Available</h3>
                  <p className="text-gray-400">
                    There are no lessons available for the selected date and filters.
                    Try selecting a different date or adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="bookings">
            <div className="space-y-8">
              {/* Upcoming Bookings */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Lessons</h2>
                
                {upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingBookings.map(booking => (
                      <Card key={booking.id} className="bg-secondary border-gray-800 border-l-4 border-l-green-600">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{booking.topic}</CardTitle>
                              <CardDescription>
                                {booking.type} - Category {booking.category}
                              </CardDescription>
                            </div>
                            
                            <Badge className={`${
                              booking.type === 'Practical' ? 'bg-blue-600' : 'bg-purple-600'
                            }`}>
                              {booking.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="py-2">
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="flex items-center text-gray-400">
                              <Clock size={16} className="mr-2 text-lider-red" />
                              <span>{booking.time} ({booking.duration} min)</span>
                            </div>
                            
                            <div className="flex items-center text-gray-400">
                              <CalendarDays size={16} className="mr-2 text-lider-red" />
                              <span>{format(new Date(booking.date), 'EEE, MMM d')}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-400">
                              <MapPin size={16} className="mr-2 text-lider-red" />
                              <span>{booking.location}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-400">
                              <User size={16} className="mr-2 text-lider-red" />
                              <span>{booking.instructor}</span>
                            </div>
                          </div>
                          
                          {booking.notes && (
                            <div className="p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-gray-200">Notes: </span>
                                {booking.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" className="w-full text-red-500 border-red-500/30 hover:bg-red-950/20">
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Lesson Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this lesson? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">
                                  Keep Booking
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-secondary border-gray-800">
                    <CardContent className="py-12 text-center">
                      <h3 className="text-xl font-medium mb-2">No Upcoming Lessons</h3>
                      <p className="text-gray-400 mb-6">
                        You don't have any upcoming lessons scheduled.
                      </p>
                      <Button 
                        className="bg-lider-red hover:bg-red-700"
                        onClick={() => setActiveTab('available')}
                      >
                        Book a Lesson
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Past Lessons */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Past Lessons</h2>
                
                {pastBookings.length > 0 ? (
                  <Table className="bg-secondary border border-gray-800 rounded-lg overflow-hidden">
                    <TableHeader className="bg-gray-800/50">
                      <TableRow className="border-gray-700 hover:bg-transparent">
                        <TableHead>Date</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastBookings.map(booking => (
                        <TableRow key={booking.id} className="border-gray-700">
                          <TableCell>
                            {format(new Date(booking.date), 'MMM d, yyyy')} at {booking.time}
                          </TableCell>
                          <TableCell>{booking.topic}</TableCell>
                          <TableCell>{booking.instructor}</TableCell>
                          <TableCell>
                            <Badge className={`${
                              booking.type === 'Practical' ? 'bg-blue-600' : 'bg-purple-600'
                            }`}>
                              {booking.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">View Feedback</Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle>Lesson Feedback</DialogTitle>
                                  <DialogDescription>
                                    {format(new Date(booking.date), 'MMMM d, yyyy')} - {booking.topic}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-gray-800/50 rounded-lg">
                                    <h4 className="font-medium mb-2">Instructor Comments:</h4>
                                    <p className="text-gray-300">{booking.performance}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Instructor:</h4>
                                      <p className="text-gray-300">{booking.instructor}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Location:</h4>
                                      <p className="text-gray-300">{booking.location}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Card className="bg-secondary border-gray-800">
                    <CardContent className="py-12 text-center">
                      <h3 className="text-xl font-medium mb-2">No Past Lessons</h3>
                      <p className="text-gray-400">
                        You haven't completed any lessons yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {isInstructor && (
            <TabsContent value="manage">
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle>Create New Lesson</CardTitle>
                  <CardDescription>
                    Schedule a new lesson for your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-6">
                    As an instructor, you can create and manage lessons for your students. 
                    This feature would contain a form to create new lessons, including fields for:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                    <li>Date and time</li>
                    <li>Duration</li>
                    <li>Lesson type (Theory/Practical)</li>
                    <li>License category</li>
                    <li>Topic</li>
                    <li>Location/Branch</li>
                    <li>Maximum number of students</li>
                  </ul>
                  <p className="text-gray-400">
                    This would be implemented in the next phase of development.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-lider-red hover:bg-red-700">
                    <Check size={16} className="mr-2" />
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Lessons;
