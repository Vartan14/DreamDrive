import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Search, Check, X, Clock, AlertCircle, Save, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import styles from './TestCreation.module.css';
import {questions, Question, Answer} from '@/types/questions'; // Adjust the import path as necessary
import { se } from 'date-fns/locale';


// Mock API functions - replace with actual API calls
const fetchQuestionPool = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return questions
};

const createCustomTest = async (testData: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock success response
  return {
    success: true,
    test_id: "custom-" + new Date().getTime(),
    message: "Test created successfully"
  };
};

interface TopicFilter {
  [key: string]: boolean;
}


const  TestCreation = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<string[]>([]); // масив унікальних тем
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isPublished, setIsPublished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all'); // для Select, "all" — всі теми
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('question-pool');

  // Load questions from the API
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);

      try {
        const data = await fetchQuestionPool();
        setQuestions(data);
        setFilteredQuestions(data);

        // Витягуємо унікальні теми з питань
        const uniqueTopics = Array.from(new Set(data.map(q => q.topic).filter(Boolean)));
        setTopics(uniqueTopics);
        // topicFilters більше не потрібен, якщо використовуємо Select
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Помилка завантаження питань. Спробуйте ще раз.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (authState.user && (authState.user.role === 'teacher' || authState.user.role === 'admin')) {
      loadQuestions();
    } else if (!authState.isLoading && (!authState.user || (authState.user.role !== 'teacher' && authState.user.role !== 'admin'))) {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive"
      });
    }
  }, [authState.isLoading, authState.user, navigate, toast]);
  
  // Filter questions based on search and filters
  useEffect(() => {
    if (!questions.length) return;

    let filtered = [...questions];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(query) ||
        q.question_number.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query)
      );
    }

    // Apply topic select filter
    if (selectedTopic && selectedTopic !== "all") {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    setFilteredQuestions(filtered);
  }, [searchQuery, selectedTopic, questions]);
  
  // Toggle question selection
  const toggleQuestionSelection = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    if (selectedQuestions.some(q => q.id === questionId)) {
      // Remove from selection
      setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
    } else {
      // Add to selection
      setSelectedQuestions(prev => [...prev, question]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
  };
  
  // Save the custom test
  const handleSaveTest = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for your test.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedQuestions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select at least one question for your test.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const testData = {
        title,
        description,
        time_limit: timeLimit,
        is_published: isPublished,
        questions: selectedQuestions.map(q => q.id)
      };
      
      const result = await createCustomTest(testData);
      
      if (result.success) {
        toast({
          title: "Test Created",
          description: "Your custom test has been created successfully."
        });
        
        // Redirect to test management
        navigate('/instructor/tests');
      } else {
        throw new Error(result.message || "Failed to create test");
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // // Loading state
  // if (loading) {
  //   return (
  //     <PageLayout>
  //       <PageHeader 
  //         title="Create Custom Test" 
  //         subtitle="Select questions and set test parameters"
  //       />
  //       <div className="container-custom py-8">
  //         <Card className="bg-secondary border-gray-800">
  //           <CardHeader>
  //             <CardTitle>
  //               <Skeleton className="h-8 w-64 bg-gray-700" />
  //             </CardTitle>
  //             <CardDescription>
  //               <Skeleton className="h-4 w-40 bg-gray-700 mt-2" />
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent className="space-y-6">
  //             <Skeleton className="h-20 w-full bg-gray-700" />
  //             <Skeleton className="h-16 w-full bg-gray-700" />
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </PageLayout>
  //   );
  // }
  
  return (
    <PageLayout>
      <PageHeader 
        title="Створення власного тесту" 
        subtitle="Оберіть питання та налаштуйте параметри тесту"
      />
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ліва частина: Деталі тесту */}
          <div className="lg:col-span-1">
            <Card className="bg-secondary border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle>Деталі тесту</CardTitle>
                <CardDescription>Налаштуйте свій власний тест</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="test-title">Назва тесту</Label>
                  <Input 
                    id="test-title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введіть назву тесту"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="test-desc">Опис (необовʼязково)</Label>
                  <Textarea 
                    id="test-desc" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Короткий опис тесту"
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="time-limit">Обмеження часу (хвилин)</Label>
                  <Input 
                    id="time-limit" 
                    type="number"
                    min={5}
                    max={60}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 30)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish-switch">Опублікувати одразу</Label>
                  <Switch 
                    id="publish-switch" 
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Обрані питання</Label>
                    <span className="text-sm font-medium">{selectedQuestions.length}</span>
                  </div>
                  
                  {selectedQuestions.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <p>Питання ще не обрано</p>
                      <p className="text-sm mt-1">Оберіть питання з банку питань</p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {selectedQuestions.map(question => (
                        <div 
                          key={question.id} 
                          className="flex items-start justify-between p-3 border border-gray-700 rounded-md mb-2 bg-gray-800/40"
                        >
                          <div>
                            <div className="font-medium truncate mb-1 max-width-200">
                              {question.text}
                            </div>
                            <div className="text-xs text-gray-400">
                              {question.topic} 
                            </div>
                          </div>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => toggleQuestionSelection(question.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  className="bg-lider-red hover:bg-red-700 w-full"
                  disabled={saving || selectedQuestions.length === 0 || !title.trim()}
                  onClick={handleSaveTest}
                >
                  {saving ? "Збереження..." : "Зберегти тест"}
                </Button>
                
                {!title.trim() && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Введіть назву тесту</span>
                  </div>
                )}
                
                {selectedQuestions.length === 0 && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Оберіть хоча б одне питання</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Права частина: Вибір питань */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger 
                  value="question-pool" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Доступні питання
                </TabsTrigger>
                <TabsTrigger 
                  value="selected-questions" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Обрані питання ({selectedQuestions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="question-pool" className="space-y-4">
                <Card className="bg-secondary border-gray-800">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="w-full md:w-2/3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Пошук за текстом, номером або темою..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                      
                      {/* Select для вибору теми */}
                      <div className="w-full md:w-1/3">
                        <Select
                          value={selectedTopic}
                          onValueChange={setSelectedTopic}
                        >
                          <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Фільтр за темою" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Всі теми</SelectItem>
                            {topics.map(topic => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Видалено чекбокси фільтра за темою */}
                    <Separator className="bg-gray-700" />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Оберіть питання</h3>
                        <span className="text-sm text-gray-400">
                          {filteredQuestions.length} знайдено
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {filteredQuestions.length === 0 ? (
                          <div className="text-center py-10 text-gray-400">
                            <p>Питань за вашим фільтром не знайдено</p>
                            <p className="text-sm mt-1">Спробуйте змінити пошук або фільтри</p>
                          </div>
                        ) : (
                          filteredQuestions.map(question => (
                            <Card 
                              key={question.id} 
                              className={`bg-gray-800/40 border-gray-700 ${
                                selectedQuestions.some(q => q.id === question.id) 
                                  ? 'border-lider-red/70' 
                                  : ''
                              }`}
                            >
                              <CardHeader className="p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        №{question.question_number}
                                      </span>
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        {question.topic}
                                      </span>
                                     
                                    </div>
                                    <CardTitle className="text-base mt-2">
                                      {question.text}
                                    </CardTitle>
                                  </div>
                                  
                                  <Button 
                                    variant={selectedQuestions.some(q => q.id === question.id) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleQuestionSelection(question.id)}
                                    className={selectedQuestions.some(q => q.id === question.id) 
                                      ? "bg-lider-red hover:bg-red-700" 
                                      : "border-gray-600"
                                    }
                                  >
                                    {selectedQuestions.some(q => q.id === question.id) ? (
                                      <>
                                        <Check size={16} className="mr-2" />
                                        Обрано
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={16} className="mr-2" />
                                        Обрати
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </CardHeader>
                              
                              {question.image && (
                                <CardContent className="p-0">
                                  <AspectRatio ratio={16 / 9} className="bg-gray-950 mx-4 mb-4 rounded-md overflow-hidden">
                                    <img 
                                      src={question.image} 
                                      alt="Зображення до питання" 
                                      className="w-full h-full object-contain"
                                    />
                                  </AspectRatio>
                                </CardContent>
                              )}
                              
                              <CardContent className="p-4 pt-0">
                                <h4 className="font-medium text-sm mb-2">Варіанти відповідей:</h4>
                                <div className="space-y-2">
                                  {question.answers.map((answer, index) => (
                                    <div 
                                      key={answer.id} 
                                      className={`text-sm p-2 rounded ${
                                        answer.is_correct 
                                          ? 'bg-green-950/20 border border-green-900/30' 
                                          : 'bg-gray-900/40 border border-gray-800'
                                      }`}
                                    >
                                      <div className="flex">
                                        <div className="w-6">{String.fromCharCode(65 + index)}.</div>
                                        <div>{answer.text}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="selected-questions" className="space-y-4">
                <Card className="bg-secondary border-gray-800">
                  <CardHeader>
                    <CardTitle>Обрані питання</CardTitle>
                    <CardDescription>
                      {selectedQuestions.length} питань обрано для цього тесту
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {selectedQuestions.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <p>Питання ще не обрано</p>
                        <p className="text-sm mt-1">Перейдіть до банку питань, щоб обрати питання</p>
                        <Button 
                          className="mt-4 bg-lider-red hover:bg-red-700"
                          onClick={() => setActiveTab('question-pool')}
                        >
                          Обрати питання
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedQuestions.map((question, index) => (
                          <Card 
                            key={question.id} 
                            className="bg-gray-800/40 border-gray-700"
                          >
                            <CardHeader className="p-3 pb-0">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-lider-red flex items-center justify-center mr-2">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        №{question.question_number}
                                      </span>
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        {question.topic}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleQuestionSelection(question.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <X size={16} className="mr-1" />
                                  Видалити
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3">
                              <p className="text-sm mb-2">{question.text}</p>
                              {question.image && (
                                <AspectRatio ratio={16 / 9} className="bg-gray-950 rounded-md overflow-hidden mb-2 max-w-xs">
                                  <img 
                                    src={question.image} 
                                    alt="Зображення до питання" 
                                    className="w-full h-full object-contain"
                                  />
                                </AspectRatio>
                              )}
                              <div className="text-xs text-gray-400">
                                {question.answers.length} відповідей • {question.answers.find(a => a.is_correct) ? "Одна правильна відповідь" : "Декілька правильних відповідей"}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="bg-lider-red hover:bg-red-700 w-full"
                      disabled={saving || selectedQuestions.length === 0 || !title.trim()}
                      onClick={handleSaveTest}
                    >
                      {saving ? "Збереження..." : "Зберегти тест"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TestCreation;
