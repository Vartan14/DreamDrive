import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreateTheoryLessonData, CreatePracticalLessonData, PracticalLesson, TheoryLesson, LessonEvent } from '@/types/scheduleInterface';
import {DateDropdowns} from '@/components/schedule/DateDropdowns';
import { fetchMyGroups, fetchAllGroups} from '@/utils/requests/groups';
import { toast } from "@/components/ui/use-toast";
import { createTheoryLesson, createPracticalLesson, updateTheoryLesson, updatePracticalLesson } from '@/utils/requests/schedule/lessons';
import { useAuthStore } from '@/store/authStore';
import { C } from 'node_modules/@fullcalendar/core/internal-common';
import { TeacherResource } from '@/utils/requests/teachers';



interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateTheoryLesson: (data: CreateTheoryLessonData) => void;
  onCreatePracticalLesson: (data: CreatePracticalLessonData) => void;
  onUpdateTheoryLesson: (data: CreateTheoryLessonData) => void;
  onUpdatePracticalLesson: (data: CreatePracticalLessonData) => void;
  useCompactDatePicker?: boolean;
  lessonToEdit: LessonEvent; 
  events: LessonEvent[]; 
  isAdmin?: boolean; 
  instructor?: TeacherResource; 
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onCreateTheoryLesson, 
  onCreatePracticalLesson,
  onUpdateTheoryLesson,
  onUpdatePracticalLesson,
  useCompactDatePicker = false,
  lessonToEdit,
  events,
  isAdmin = false,
  instructor
}) => {
  const authStore = useAuthStore();
  const [lessonType, setLessonType] = useState('theory');
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  const initialYear = selectedDate.getFullYear();
  const initialMonth = selectedDate.getMonth() + 1;
  const initialDay = selectedDate.getDate();
  const initialHours = selectedDate.getHours().toString().padStart(2, '0');
  const initialMinutes = selectedDate.getMinutes().toString().padStart(2, '0');
  const timeStr = `${initialHours}:${initialMinutes}`;
  

  // Theory lesson state
  const [theoryFormData, setTheoryFormData] = useState<CreateTheoryLessonData>({
    date: selectedDate,
    time: timeStr,
    lesson_title: '',
    duration: '01:00:00', 
    group:{
      id: '',
      name:  '',
    },
    filial_id: '1',
    is_online: false,
  });
  
  const [theoryYear, setTheoryYear] = useState(initialYear.toString());
  const [theoryMonth, setTheoryMonth] = useState(initialMonth.toString());
  const [theoryDay, setTheoryDay] = useState(initialDay.toString());
  
  // Practical lesson form state
  const [practicalFormData, setPracticalFormData] = useState<CreatePracticalLessonData>({
    date: selectedDate,
    time: timeStr,
    lesson_title:'',
    duration: '01:00:00', 
    filial_id: '1',
    car: '',
    location: ''
  });
  
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
  
  React.useEffect(() => {
    const fetchGroups = async () => {
      try { 
        let groups = [];     
        if (isAdmin) {
          groups = await fetchAllGroups(true); 
        }
        else {  
          groups = await fetchMyGroups(true);
        }
        setGroups(groups); // збережіть у стані
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);


  // React to changes in date dropdowns
  React.useEffect(() => {
    updateTheoryDate();
  }, [theoryYear, theoryMonth, theoryDay]);
  
  React.useEffect(() => {
    updatePracticalDate();
  }, [practicalYear, practicalMonth, practicalDay]);
  
  // Update state when selectedDate changes
  React.useEffect(() => {
    const hours= (selectedDate.getHours()).toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');

    const timeStr = `${hours}:${minutes}`;

    setTheoryFormData(prev => ({ ...prev, time: timeStr, date: selectedDate }));
    setPracticalFormData(prev => ({ ...prev, time: timeStr, date: selectedDate }));

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
  
  const validateNotPastDate = (date: Date) => {
    if (new Date(date).getTime() < Date.now()) {
      toast({
        title: "Помилка",
        description: "Неможливо створити заняття у минулому!",
        variant: "destructive",
        duration: 2000
      });
      return false;
    }
    return true;
  };

  const validateTimeRange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (!(totalMinutes >= 7 * 60 && totalMinutes < 18 * 60)) {
      toast({
        title: "Недопустимий час",
        description: "Заняття можна додати лише з 07:00 до 18:00.",
        variant: "destructive",
        duration: 2000
      });
      return false;
    }
    return true;
  };

  const  getTheoryLessonData = (form: CreateTheoryLessonData): TheoryLesson => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = form.date.getFullYear();
    const month = pad(form.date.getMonth() + 1);
    const day = pad(form.date.getDate());
    const start_time = `${year}-${month}-${day}T${form.time}`;
     

    return {
      title: form.lesson_title,
      start_time,
      duration: form.duration,
      filial_id: form.filial_id.toString(),
      group_id: form.group.id.toString(),
      is_online: form.is_online,
      instructor_name: instructor?.name|| (authStore.user?.first_name + ' ' + authStore.user?.last_name) || '',
    };
  };

  const getPracticalLessonData = (form: CreatePracticalLessonData): PracticalLesson => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = form.date.getFullYear();
    const month = pad(form.date.getMonth() + 1);
    const day = pad(form.date.getDate());
    const start_time = `${year}-${month}-${day}T${form.time}`;
    return {
      title: form.lesson_title,
      start_time,
      duration: form.duration,
      filial_id: form.filial_id.toString(),
      car: form.car,
      location: form.location,
      instructor_name: instructor?.name || (authStore.user?.first_name + ' ' + authStore.user?.last_name) || '',
      
    };
  };

  const isEditMode = Boolean(lessonToEdit);

  const parseDate = (dateStr: string) => {
  
    const date = new Date(dateStr);
    const hours= (date.getHours() - 3).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;

    return {
      date: date,
      time: time,
    }; 
  }  

  React.useEffect(() => {
    if (lessonToEdit) {

      const { date, time } = parseDate(lessonToEdit.start);

      if (lessonToEdit.type === 'theory') {
        setLessonType('theory');      
        setTheoryFormData({
          date: date,
          time: time,
          lesson_title: lessonToEdit.lesson_title,
          duration: lessonToEdit.duration,
          group: {
            id: lessonToEdit.group_id ,
            name: lessonToEdit.group ,
          },
          filial_id: lessonToEdit.filial_id?.toString() || '1',
          is_online: lessonToEdit.is_online || false,
        });


      } else if (lessonToEdit.type === 'practical') {
        setLessonType('practical');
        setPracticalFormData({
          date: date,
          time: time,
          lesson_title: lessonToEdit.lesson_title ,
          duration: lessonToEdit.duration,
          filial_id: lessonToEdit.filial_id?.toString() || '1',
          car: lessonToEdit.car || '',
          location: lessonToEdit.location || '',
        });
      }
    }
  }, [lessonToEdit]);


  function isLessonOverlapping(
    start: string,  // формат: "2025-06-02T08:00:00"
    duration: string // формат: "HH:mm:ss"
  ): boolean {
    const startDate = new Date(start);
    const [h, m, s] = duration.split(':').map(Number);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + (h || 0));
    endDate.setMinutes(endDate.getMinutes() + (m || 0));
    endDate.setSeconds(endDate.getSeconds() + (s || 0));

    console.log(`Перевірка перетину: ${startDate} - ${endDate}`);

    return events.some(event => {
      const eventStart = new Date(event.start.replace('Z', ''));
      const eventEnd = new Date(event.end.replace('Z', ''));
      
      const flag = startDate < eventEnd && endDate > eventStart;
      if (flag) {

        console.log(`Перетин знайдено: ${eventStart} - ${eventEnd}`);
      } 
      return startDate < eventEnd && endDate > eventStart;
    });
  }

  const handleSubmitTheory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNotPastDate(theoryFormData.date)) return;
    if (!validateTimeRange(theoryFormData.time)) return;

    const data = getTheoryLessonData(theoryFormData);

    if (isLessonOverlapping(data.start_time, data.duration  )) {
      toast({
        title: "Перетин занять",
        description: "Нове заняття перетинається з уже існуючим у розкладі!",
        variant: "destructive",
        duration: 3000
      });
      return;
    }


    try {
      console.log("Submitting theory lesson data:", data);

      if (isEditMode && lessonToEdit?.type === 'theory') {
        await updateTheoryLesson(Number(lessonToEdit.id), data);
        toast({
          title: "Успіх",
          description: "Теоретичне заняття оновлено!",
          variant: "default",
          duration: 2000
        });

        onUpdateTheoryLesson({ ...theoryFormData, time: data.start_time, id: lessonToEdit.id });
      } else {
        let res = {id: '0'};
        if (isAdmin){
          res = await createTheoryLesson(data, instructor.id);
        }
        else {
          res = await createTheoryLesson(data);
        }
        toast({
          title: "Успіх",
          description: "Теоретичне заняття створено!",
          variant: "default",
          duration: 2000
        });
        onCreateTheoryLesson({ ...theoryFormData, time: data.start_time, id: res.id });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти заняття.",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleSubmitPractical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNotPastDate(practicalFormData.date)) return;
    if (!validateTimeRange(practicalFormData.time)) return;

    const data = getPracticalLessonData(practicalFormData);
  
    if (isLessonOverlapping(data.start_time, data.duration  )) {
      toast({
        title: "Перетин занять",
        description: "Нове заняття перетинається з уже існуючим у розкладі!",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      if (isEditMode && lessonToEdit?.type === 'practical') {
        await updatePracticalLesson(Number(lessonToEdit.id), data);
        toast({
          title: "Успіх",
          description: "Практичне заняття оновлено!",
          variant: "default",
          duration: 2000
        });
        onUpdatePracticalLesson({ ...practicalFormData, time: data.start_time, id: lessonToEdit.id });
      } else {
        let res = {id: "0"};
        if (isAdmin){ 
          res = await createPracticalLesson(data, instructor.id);
        }
        else {
          res = await createPracticalLesson(data);
        }
        toast({
          title: "Успіх",
          description: "Практичне заняття створено!",
          variant: "default",
          duration: 2000
        });
        onCreatePracticalLesson({...practicalFormData, time: data.start_time, id: res.id});
      }
      onClose();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти заняття.",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  React.useEffect(() => {
    if (groups.length > 0) {
      setTheoryFormData(prev => ({
        ...prev,
        group: { id: groups[0].id, name: groups[0].name }
      }));
    }
  }, [groups]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Додати нове заняття</DialogTitle>
          <DialogDescription className="text-gray-400">
            Заплануйте нове заняття для студентів
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="theory" value={lessonType} onValueChange={setLessonType}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="theory">Теоретичне заняття</TabsTrigger>
            <TabsTrigger value="practical">Практичне заняття</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theory">
            <form onSubmit={handleSubmitTheory} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="theory-title">Назва заняття</Label>
                  <Input
                    id="theory-title"
                    placeholder="Напр., Вступ до дорожніх знаків"
                    value={theoryFormData.lesson_title || ''}
                    onChange={(e) => handleTheoryFormChange('lesson_title', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
              </div>           

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theory-date">Дата</Label>
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
                  <Label htmlFor="theory-time">Час</Label>
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
                {/* Group field moved up */}
                <div className="space-y-2">
                  <Label htmlFor="theory-group">Група</Label>
                  <Select
                    value={theoryFormData.group?.id || ''}
                    onValueChange={(value) => {
                      const selectedGroup = groups.find(g => g.id.toString() === value.toString());
                      setTheoryFormData(prev => ({
                        ...prev,
                        group: selectedGroup ? { id: selectedGroup.id, name: selectedGroup.name } : { id: '', name: '' }
                      }));
                    }}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Оберіть групу" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {groups.length === 0 ? (
                        <SelectItem value="" disabled>Групи не знайдено</SelectItem>
                      ) : (
                        groups.map(group => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theory-branch">Філія</Label>
                  <Select
                    value={theoryFormData.filial_id}
                    onValueChange={(value) => handleTheoryFormChange('filial_id', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Оберіть філію" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1">Філія 1</SelectItem>
                      <SelectItem value="2">Філія 2</SelectItem>
                      <SelectItem value="3">Філія 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theory-duration">Тривалість</Label>
                  <Select
                    value={theoryFormData.duration}
                    onValueChange={(value) => handleTheoryFormChange('duration', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700" id="theory-duration">
                      <SelectValue placeholder="Оберіть тривалість" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="00:30:00">30 хвилин</SelectItem>
                      <SelectItem value="00:45:00">45 хвилин</SelectItem>
                      <SelectItem value="01:00:00">1 година</SelectItem>
                      <SelectItem value="01:30:00">1,5 години</SelectItem>
                      <SelectItem value="02:00:00">2 години</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 h-full pt-8">
                  <Switch
                    id="theory-online"
                    checked={theoryFormData.is_online}
                    onCheckedChange={(checked) => handleTheoryFormChange('is_online', checked)}
                  />
                  <Label htmlFor="theory-online">Онлайн заняття</Label>
                </div>
              </div>
              
              {/* DialogFooter */}
              <div className="flex justify-between mt-6 gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Скасувати
                </Button>
                <Button type="submit" className="bg-lider-red hover:bg-red-700">
                  {isEditMode ? 'Зберегти зміни' : 'Створити заняття'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="practical">
            <form onSubmit={handleSubmitPractical} className="space-y-4 py-4">
              {/* Додаємо поле назва заняття */}
              <div className="space-y-2">
                <Label htmlFor="practical-title">Назва заняття</Label>
                <Input
                  id="practical-title"
                  placeholder="Напр., Перше водіння"
                  value={practicalFormData.lesson_title || ''}
                  onChange={(e) => handlePracticalFormChange('lesson_title', e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="practical-date">Дата</Label>
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
                  <Label htmlFor="practical-time">Час</Label>
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
                  <Label htmlFor="practical-duration">Тривалість (хвилин)</Label>
                  <Select
                    value={practicalFormData.duration}
                    onValueChange={(value) => handlePracticalFormChange('duration', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700" id="theory-duration">
                      <SelectValue placeholder="Оберіть тривалість" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="00:30:00">30 хвилин</SelectItem>
                      <SelectItem value="00:45:00">45 хвилин</SelectItem>
                      <SelectItem value="01:00:00">1 година</SelectItem>
                      <SelectItem value="01:30:00">1,5 години</SelectItem>
                      <SelectItem value="02:00:00">2 години</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="practical-branch">Філія</Label>
                  <Select
                    value={practicalFormData.filial_id}
                    onValueChange={(value) => handlePracticalFormChange('filial_id', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Оберіть філію" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1">Філія 1</SelectItem>
                      <SelectItem value="2">Філія 2</SelectItem>
                      <SelectItem value="3">Філія 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Автомобіль */}
                <div className="space-y-2">
                  <Label htmlFor="practical-car">Автомобіль</Label>
                  <Input
                    id="practical-car"
                    type="text"
                    value={practicalFormData.car}
                    onChange={(e) => handlePracticalFormChange('car', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="Вкажіть автомобіль"
                    required
                  />
                </div>
                {/* Локація */}
                <div className="space-y-2">
                  <Label htmlFor="practical-location">Локація</Label>
                  <Input
                    id="practical-location"
                    type="text"
                    value={practicalFormData.location}
                    onChange={(e) => handlePracticalFormChange('location', e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="Вкажіть локацію"
                    required
                  />
                </div>
              </div>
              
              {/* Замість DialogFooter */}
              <div className="flex justify-between mt-6 gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Скасувати
                </Button>
                <Button type="submit" className="bg-lider-red hover:bg-red-700">
                  {isEditMode ? 'Зберегти зміни' : 'Створити заняття'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
