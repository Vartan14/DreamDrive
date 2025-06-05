import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  BarChart2
} from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';


const mockStudentData = {
  id: '1',
  name: 'John Student',
  email: 'john@example.com',
  profilePicture: '',
  progress: {
    overall: 65,
    theory: 80,
    practical: 50,
    completedMaterials: 8,
    totalMaterials: 15,
    completedTests: 4,
    totalTests: 6
  },
  testScores: [
    { id: 1, title: 'Basic Road Rules - Test 1', score: 85, date: '2023-05-15', maxScore: 100 },
    { id: 2, title: 'Traffic Signs - Test 1', score: 92, date: '2023-05-20', maxScore: 100 },
    { id: 3, title: 'Right of Way - Test 1', score: 78, date: '2023-05-25', maxScore: 100 },
    { id: 4, title: 'Defensive Driving', score: 88, date: '2023-06-01', maxScore: 100 },
  ],
  completedMaterials: [
    { id: 1, title: 'Getting Started with Driving', completedDate: '2023-05-10' },
    { id: 2, title: 'Understanding Your Vehicle', completedDate: '2023-05-12' },
    { id: 3, title: 'Pre-Driving Checks', completedDate: '2023-05-14' },
    { id: 4, title: 'Warning Signs', completedDate: '2023-05-16' },
    { id: 5, title: 'Regulatory Signs', completedDate: '2023-05-18' },
    { id: 6, title: 'Right of Way Rules', completedDate: '2023-05-22' },
    { id: 7, title: 'Basic Vehicle Controls', completedDate: '2023-05-26' },
    { id: 8, title: 'Hazard Awareness', completedDate: '2023-05-30' },
  ],
  upcomingLessons: [
    { id: 1, type: 'Practical', date: '2023-06-15', time: '14:00', topic: 'Parallel Parking' },
    { id: 2, type: 'Theory', date: '2023-06-18', time: '10:00', topic: 'Highway Driving Rules' }
  ],
  practicalSkills: [
    { skill: 'Basic Control', rating: 4, notes: 'Good control of steering and pedals' },
    { skill: 'Parking', rating: 3, notes: 'Improving parallel parking, still needs practice' },
    { skill: 'Lane Changes', rating: 4, notes: 'Good use of mirrors and signaling' },
    { skill: 'Traffic Navigation', rating: 3, notes: 'Adequate, but can be more confident' },
    { skill: 'Highway Driving', rating: 2, notes: 'Needs more practice with merging' },
    { skill: 'Night Driving', rating: 3, notes: 'Good awareness but could improve speed control' }
  ],
  notes: [
    { id: 1, date: '2023-06-01', content: 'Making good progress with basic maneuvers. Needs more practice with parallel parking.' },
    { id: 2, date: '2023-05-25', content: 'Completed theory section on traffic signs with excellent understanding.' }
  ]
};

const InstructorStudentProgress = () => {
  const { studentId } = useParams<{ studentId?: string }>();
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  
  // For demo purposes, we're using the mock data
  // In a real app, you would fetch the student data based on the studentId
  const student = mockStudentData;
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, you would save this to the backend
      alert(`Note added: ${newNote}`);
      setNewNote('');
    }
  };


  // Skill rating renderer
  const SkillRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`w-4 h-4 rounded-full mr-1 ${
            i < rating ? 'bg-lider-red' : 'bg-gray-700'
          }`}
        ></div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <PageLayout>
        <div className="container-custom py-12">
          <Button 
            variant="outline" 
            onClick={() => navigate('/instructor/groups')}
            className="mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            До груп
          </Button>
          
          {/* Заголовок студента */}
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            <Avatar className="w-20 h-20 rounded-lg border-2 border-gray-700">
              <AvatarImage src={student.profilePicture} />
              <AvatarFallback className="bg-gray-800 text-xl">{student.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <p className="text-gray-400 mb-2">{student.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <BookOpen size={16} className="text-lider-red mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">{student.progress.completedMaterials}</span>
                    <span className="text-gray-400">/{student.progress.totalMaterials} матеріалів</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Award size={16} className="text-lider-red mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">{student.progress.completedTests}</span>
                    <span className="text-gray-400">/{student.progress.totalTests} тестів</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Картки огляду прогресу */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-secondary border-gray-800">
              <CardContent className="pt-6">
                <h3 className="flex items-center text-lg mb-2">
                  <BarChart2 size={18} className="mr-2 text-lider-red" />
                  Загальний прогрес
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Прогрес</span>
                    <span className="text-sm font-medium">{student.progress.overall}%</span>
                  </div>
                  <Progress value={student.progress.overall} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-gray-800">
              <CardContent className="pt-6">
                <h3 className="flex items-center text-lg mb-2">
                  <BookOpen size={18} className="mr-2 text-lider-red" />
                  Теоретичні знання
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Прогрес</span>
                    <span className="text-sm font-medium">{student.progress.theory}%</span>
                  </div>
                  <Progress value={student.progress.theory} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-gray-800">
              <CardContent className="pt-6">
                <h3 className="flex items-center text-lg mb-2">
                  <Award size={18} className="mr-2 text-lider-red" />
                  Практичні навички
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Прогрес</span>
                    <span className="text-sm font-medium">{student.progress.practical}%</span>
                  </div>
                  <Progress value={student.progress.practical} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div> */}
          
          {/* Вкладки */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-lg mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-lider-red">
                Огляд
              </TabsTrigger>
              <TabsTrigger value="theory" className="data-[state=active]:bg-lider-red">
                Теорія
              </TabsTrigger>
              <TabsTrigger value="practical" className="data-[state=active]:bg-lider-red">
                Практика
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-lider-red">
                Нотатки
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Результати тестів */}
                <Card className="bg-secondary border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award size={18} className="mr-2 text-lider-red" />
                      Результати тестів
                    </CardTitle>
                    <CardDescription>
                      Останні результати тестів та оцінювання
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {student.testScores.map(test => (
                      <div key={test.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{test.title}</span>
                          <span className={`font-medium ${
                            test.score >= 80 ? 'text-green-500' : 
                            test.score >= 60 ? 'text-yellow-500' : 
                            'text-red-500'
                          }`}>
                            {test.score}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{new Date(test.date).toLocaleDateString()}</span>
                          <span>{test.score}/{test.maxScore} балів</span>
                        </div>
                        <Progress 
                          value={test.score} 
                          className="h-2 mt-2" 
                          indicatorClassName={`${
                            test.score >= 80 ? 'bg-green-500' : 
                            test.score >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Майбутні заняття */}
                <Card className="bg-secondary border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar size={18} className="mr-2 text-lider-red" />
                      Заплановані заняття
                    </CardTitle>
                    <CardDescription>
                      Заплановані лекції та практичні заняття
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {student.upcomingLessons.map(lesson => (
                      <div key={lesson.id} className="p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge className={`mr-3 ${
                              lesson.type === 'Practical' ? 'bg-blue-600' : 'bg-purple-600'
                            }`}>
                              {lesson.type === 'Practical' ? 'Практика' : 'Теорія'}
                            </Badge>
                            <h4 className="font-medium">{lesson.topic}</h4>
                          </div>
                          <Button variant="outline" size="sm">
                            Змінити
                          </Button>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar size={14} className="mr-2" />
                          {new Date(lesson.date).toLocaleDateString()}
                          <Clock size={14} className="ml-4 mr-2" />
                          {lesson.time}
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full bg-lider-red hover:bg-red-700">
                      Запланувати нове заняття
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="theory">
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen size={18} className="mr-2 text-lider-red" />
                    Завершені навчальні матеріали
                  </CardTitle>
                  <CardDescription>
                    Теоретичні матеріали, які студент опрацював
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Виконано</span>
                      <span className="text-sm font-medium">
                        {student.progress.completedMaterials}/{student.progress.totalMaterials} ({Math.round((student.progress.completedMaterials / student.progress.totalMaterials) * 100)}%)
                      </span>
                    </div>
                    <Progress 
                      value={Math.round((student.progress.completedMaterials / student.progress.totalMaterials) * 100)} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {student.completedMaterials.map(material => (
                      <div key={material.id} className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                        <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{material.title}</div>
                          <div className="text-xs text-gray-400">
                            Завершено {new Date(material.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                        {/* <Button variant="ghost" size="sm" className="text-lider-red hover:text-red-400">
                          Детальніше
                        </Button> */}
                      </div>
                    ))}
                    
                    {student.completedMaterials.length < student.progress.totalMaterials && (
                      <div className="flex items-center p-4 border border-dashed border-gray-700 rounded-lg">
                        <AlertCircle size={16} className="text-yellow-500 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-gray-400">
                          {student.progress.totalMaterials - student.progress.completedMaterials} матеріалів залишилось пройти
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="practical">
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award size={18} className="mr-2 text-lider-red" />
                    Оцінка практичних навичок
                  </CardTitle>
                  <CardDescription>
                    Оцінювання практичних навичок водіння студента
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {student.practicalSkills.map((skill, index) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h4 className="font-medium mb-2 md:mb-0">{skill.skill}</h4>
                          <SkillRating rating={skill.rating} />
                        </div>
                        <p className="text-sm text-gray-400">{skill.notes}</p>
                      </div>
                    ))}
                    
                    <Button className="w-full bg-lider-red hover:bg-red-700">
                      Оновити оцінку навичок
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card className="bg-secondary border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen size={18} className="mr-2 text-lider-red" />
                    Нотатки інструктора
                  </CardTitle>
                  <CardDescription>
                    Особисті нотатки та спостереження щодо студента
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Textarea 
                      placeholder="Додайте нову нотатку про цього студента..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-3 bg-gray-800 border-gray-700"
                    />
                    <Button 
                      onClick={handleAddNote}
                      className="bg-lider-red hover:bg-red-700"
                    >
                      Додати нотатку
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {student.notes.map(note => (
                      <div key={note.id} className="p-4 border border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </ProtectedRoute>  
  );
};

export default InstructorStudentProgress;
