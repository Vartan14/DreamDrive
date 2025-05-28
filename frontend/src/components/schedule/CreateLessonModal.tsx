
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreateTheoryLessonData, CreatePracticalLessonData } from '@/types/schedule';

// Years, months, and days for dropdowns
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

// Cars for dropdown
const CARS = [
  { value: 'toyota_corolla', label: 'Toyota Corolla AB1234CD' },
  { value: 'vw_polo', label: 'VW Polo BC5678EF' },
  { value: 'ford_focus', label: 'Ford Focus GH9012IJ' },
  { value: 'honda_civic', label: 'Honda Civic KL3456MN' },
  { value: 'skoda_octavia', label: 'Škoda Octavia OP7890QR' }
];

// Locations for dropdown
const LOCATIONS = [
  { value: 'main', label: 'Main Branch' },
  { value: 'north', label: 'North Branch' },
  { value: 'east', label: 'East Branch' },
  { value: 'west', label: 'West Branch' },
  { value: 'south', label: 'South Branch' }
];

// Compact date selector component with dropdowns
const DateDropdowns = ({ 
  year, 
  month, 
  day, 
  onYearChange, 
  onMonthChange, 
  onDayChange 
}) => {
  // Get max days in the selected month
  const getMaxDays = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  
  const maxDays = month ? getMaxDays(year || new Date().getFullYear(), parseInt(month)) : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);
  
  return (
    <div className="flex gap-2">
      <div className="w-1/3">
        <Select value={day?.toString()} onValueChange={onDayChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
            {days.map(d => (
              <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/3">
        <Select value={month?.toString()} onValueChange={onMonthChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {MONTHS.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-1/3">
        <Select value={year?.toString()} onValueChange={onYearChange}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {YEARS.map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateTheoryLesson: (data: CreateTheoryLessonData) => void;
  onCreatePracticalLesson: (data: CreatePracticalLessonData) => void;
  useCompactDatePicker?: boolean;
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onCreateTheoryLesson, 
  onCreatePracticalLesson,
  useCompactDatePicker = false
}) => {
  const [lessonType, setLessonType] = useState('theory');
  
  // Get initial date values from selectedDate
  const initialYear = selectedDate.getFullYear();
  const initialMonth = selectedDate.getMonth() + 1;
  const initialDay = selectedDate.getDate();
  
  // Theory lesson form state
  const [theoryFormData, setTheoryFormData] = useState<CreateTheoryLessonData>({
    date: selectedDate,
    time: '10:00',
    duration: '60',
    group_id: 'A1',
    filial_id: '1',
    is_online: false,
    title: 'Theory Lesson'
  });
  
  // State for date components (theory)
  const [theoryYear, setTheoryYear] = useState(initialYear.toString());
  const [theoryMonth, setTheoryMonth] = useState(initialMonth.toString());
  const [theoryDay, setTheoryDay] = useState(initialDay.toString());
  
  // Practical lesson form state
  const [practicalFormData, setPracticalFormData] = useState<CreatePracticalLessonData>({
    date: selectedDate,
    time: '14:00',
    duration: '60',
    filial_id: '1',
    car: 'toyota_corolla',
    location: 'main'
  });
  
  // State for date components (practical)
  const [practicalYear, setPracticalYear] = useState(initialYear.toString());
  const [practicalMonth, setPracticalMonth] = useState(initialMonth.toString());
  const [practicalDay, setPracticalDay] = useState(initialDay.toString());
  
  // Update theory date when dropdowns change
  const updateTheoryDate = () => {
    if (theoryYear && theoryMonth && theoryDay) {
      const newDate = new Date(
        parseInt(theoryYear), 
        parseInt(theoryMonth) - 1, 
        parseInt(theoryDay)
      );
      
      if (!isNaN(newDate.getTime())) {
        setTheoryFormData(prev => ({ ...prev, date: newDate }));
      }
    }
  };
  
  // Update practical date when dropdowns change
  const updatePracticalDate = () => {
    if (practicalYear && practicalMonth && practicalDay) {
      const newDate = new Date(
        parseInt(practicalYear), 
        parseInt(practicalMonth) - 1, 
        parseInt(practicalDay)
      );
      
      if (!isNaN(newDate.getTime())) {
        setPracticalFormData(prev => ({ ...prev, date: newDate }));
      }
    }
  };
  
  // React to changes in date dropdowns
  React.useEffect(() => {
    updateTheoryDate();
  }, [theoryYear, theoryMonth, theoryDay]);
  
  React.useEffect(() => {
    updatePracticalDate();
  }, [practicalYear, practicalMonth, practicalDay]);
  
  // Update state when selectedDate changes
  React.useEffect(() => {
    setTheoryFormData(prev => ({ ...prev, date: selectedDate }));
    setPracticalFormData(prev => ({ ...prev, date: selectedDate }));
    
    setTheoryYear(selectedDate.getFullYear().toString());
    setTheoryMonth((selectedDate.getMonth() + 1).toString());
    setTheoryDay(selectedDate.getDate().toString());
    
    setPracticalYear(selectedDate.getFullYear().toString());
    setPracticalMonth((selectedDate.getMonth() + 1).toString());
    setPracticalDay(selectedDate.getDate().toString());
  }, [selectedDate]);
  
  const handleTheoryFormChange = (field: string, value: any) => {
    setTheoryFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePracticalFormChange = (field: string, value: any) => {
    setPracticalFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmitTheory = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTheoryLesson(theoryFormData);
    onClose();
  };
  
  const handleSubmitPractical = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePracticalLesson(practicalFormData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription className="text-gray-400">
            Schedule a new lesson for students
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="theory" value={lessonType} onValueChange={setLessonType}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="theory">Theory Lesson</TabsTrigger>
            <TabsTrigger value="practical">Practical Lesson</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theory">
            <form onSubmit={handleSubmitTheory} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="theory-title">Lesson Title</Label>
                <Input
                  id="theory-title"
                  placeholder="e.g., Introduction to Road Signs"
                  value={theoryFormData.title}
                  onChange={(e) => handleTheoryFormChange('title', e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Group field moved up */}
                <div className="space-y-2">
                  <Label htmlFor="theory-group">Group</Label>
                  <Select
                    value={theoryFormData.group_id}
                    onValueChange={(value) => handleTheoryFormChange('group_id', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="A1">Group A1</SelectItem>
                      <SelectItem value="A2">Group A2</SelectItem>
                      <SelectItem value="B1">Group B1</SelectItem>
                      <SelectItem value="B2">Group B2</SelectItem>
                      <SelectItem value="C1">Group C1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theory-branch">Branch</Label>
                  <Select
                    value={theoryFormData.filial_id}
                    onValueChange={(value) => handleTheoryFormChange('filial_id', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1">Main Branch</SelectItem>
                      <SelectItem value="2">North Branch</SelectItem>
                      <SelectItem value="3">East Branch</SelectItem>
                      <SelectItem value="4">West Branch</SelectItem>
                      <SelectItem value="5">South Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theory-date">Date</Label>
                  <DateDropdowns
                    year={parseInt(theoryYear)}
                    month={parseInt(theoryMonth)}
                    day={parseInt(theoryDay)}
                    onYearChange={(y) => setTheoryYear(y)}
                    onMonthChange={(m) => setTheoryMonth(m)}
                    onDayChange={(d) => setTheoryDay(d)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theory-time">Time</Label>
                  <Input
                    id="theory-time"
                    type="time"
                    value={theoryFormData.time}
                    onChange={(e) => handleTheoryFormChange('time', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theory-duration">Duration (minutes)</Label>
                  <Select
                    value={theoryFormData.duration}
                    onValueChange={(value) => handleTheoryFormChange('duration', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 h-full pt-8">
                  <Switch
                    id="theory-online"
                    checked={theoryFormData.is_online}
                    onCheckedChange={(checked) => handleTheoryFormChange('is_online', checked)}
                  />
                  <Label htmlFor="theory-online">Online Lesson</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-lider-red hover:bg-red-700">
                  Create Theory Lesson
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="practical">
            <form onSubmit={handleSubmitPractical} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="practical-date">Date</Label>
                  <DateDropdowns
                    year={parseInt(practicalYear)}
                    month={parseInt(practicalMonth)}
                    day={parseInt(practicalDay)}
                    onYearChange={(y) => setPracticalYear(y)}
                    onMonthChange={(m) => setPracticalMonth(m)}
                    onDayChange={(d) => setPracticalDay(d)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="practical-time">Time</Label>
                  <Input
                    id="practical-time"
                    type="time"
                    value={practicalFormData.time}
                    onChange={(e) => handlePracticalFormChange('time', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="practical-duration">Duration (minutes)</Label>
                  <Select
                    value={practicalFormData.duration}
                    onValueChange={(value) => handlePracticalFormChange('duration', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="practical-branch">Branch</Label>
                  <Select
                    value={practicalFormData.filial_id}
                    onValueChange={(value) => handlePracticalFormChange('filial_id', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1">Main Branch</SelectItem>
                      <SelectItem value="2">North Branch</SelectItem>
                      <SelectItem value="3">East Branch</SelectItem>
                      <SelectItem value="4">West Branch</SelectItem>
                      <SelectItem value="5">South Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="practical-car">Vehicle</Label>
                  <Select
                    value={practicalFormData.car}
                    onValueChange={(value) => handlePracticalFormChange('car', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {CARS.map(car => (
                        <SelectItem key={car.value} value={car.value}>
                          {car.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="practical-location">Location</Label>
                  <Select
                    value={practicalFormData.location}
                    onValueChange={(value) => handlePracticalFormChange('location', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-lider-red hover:bg-red-700">
                  Create Practical Lesson
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
