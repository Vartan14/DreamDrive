
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
import styles from './TestCreation.module.css';

// Mock API functions - replace with actual API calls
const fetchQuestionPool = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 3576,
      question_number: "1651",
      text: "What does this traffic sign indicate?",
      image: "https://images.unsplash.com/photo-1550656738-8b2c643afcbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      topic: "Road Signs",
      difficulty: "Medium",
      answers: [
        {
          id: 11376,
          text: "A road with a designated lane for vehicles and cyclists to follow a specific route.",
          is_correct: true
        },
        {
          id: 11377,
          text: "A road where cyclists are not allowed.",
          is_correct: false
        },
        {
          id: 11378,
          text: "A warning that there may be cyclists on the road.",
          is_correct: false
        },
        {
          id: 11379,
          text: "A dedicated bike path separate from the road.",
          is_correct: false
        }
      ]
    },
    {
      id: 3577,
      question_number: "1652",
      text: "When approaching a pedestrian crossing with no traffic lights, you should:",
      topic: "Road Rules",
      difficulty: "Easy",
      answers: [
        {
          id: 11380,
          text: "Speed up to cross quickly.",
          is_correct: false
        },
        {
          id: 11381,
          text: "Maintain your speed but be prepared to stop.",
          is_correct: false
        },
        {
          id: 11382,
          text: "Slow down and be prepared to stop for pedestrians.",
          is_correct: true
        },
        {
          id: 11383,
          text: "Stop only if there are pedestrians already crossing.",
          is_correct: false
        }
      ]
    },
    {
      id: 3578,
      question_number: "1653",
      text: "What is the proper action when you see this road sign?",
      image: "https://images.unsplash.com/photo-1590837343047-7ac279e5e183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHN0b3AlMjBzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      topic: "Road Signs",
      difficulty: "Easy",
      answers: [
        {
          id: 11384,
          text: "Slow down and proceed if the way is clear.",
          is_correct: false
        },
        {
          id: 11385,
          text: "Come to a complete stop and proceed only when safe.",
          is_correct: true
        },
        {
          id: 11386,
          text: "Yield to traffic on the main road.",
          is_correct: false
        },
        {
          id: 11387,
          text: "Stop only if there is traffic approaching.",
          is_correct: false
        }
      ]
    },
    {
      id: 3579,
      question_number: "1654",
      text: "What is the speed limit in a residential area unless otherwise posted?",
      topic: "Speed Limits",
      difficulty: "Medium",
      answers: [
        {
          id: 11388,
          text: "30 km/h",
          is_correct: false
        },
        {
          id: 11389,
          text: "50 km/h",
          is_correct: true
        },
        {
          id: 11390,
          text: "60 km/h",
          is_correct: false
        },
        {
          id: 11391,
          text: "70 km/h",
          is_correct: false
        }
      ]
    },
    {
      id: 3580,
      question_number: "1655",
      text: "When making a right turn, you should:",
      topic: "Road Rules",
      difficulty: "Medium",
      answers: [
        {
          id: 11392,
          text: "Signal early, move to the right lane, and turn from the right lane.",
          is_correct: true
        },
        {
          id: 11393,
          text: "Signal at the last moment and turn from any lane.",
          is_correct: false
        },
        {
          id: 11394,
          text: "Signal early, stay in the left lane, and turn across traffic.",
          is_correct: false
        },
        {
          id: 11395,
          text: "No signal is required for right turns.",
          is_correct: false
        }
      ]
    }
  ];
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

interface Question {
  id: number;
  question_number: string;
  text: string;
  image?: string;
  topic: string;
  difficulty: string;
  answers: Answer[];
  selected?: boolean;
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface TopicFilter {
  [key: string]: boolean;
}

const  TestCreation = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isPublished, setIsPublished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilters, setTopicFilters] = useState<TopicFilter>({});
  const [difficultyFilters, setDifficultyFilters] = useState<{[key: string]: boolean}>({
    'Easy': false,
    'Medium': false,
    'Hard': false
  });
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
        
        // Extract unique topics for filters
        const topics: TopicFilter = {};
        data.forEach(q => {
          if (q.topic) {
            topics[q.topic] = false;
          }
        });
        setTopicFilters(topics);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (authState.user && (authState.user.role === 'teacger' || authState.user.role === 'admin')) {
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
    
    // Apply topic filters
    const activeTopicFilters = Object.entries(topicFilters)
      .filter(([_, isActive]) => isActive)
      .map(([topic]) => topic);
      
    if (activeTopicFilters.length) {
      filtered = filtered.filter(q => activeTopicFilters.includes(q.topic));
    }
    
    // Apply difficulty filters
    const activeDifficultyFilters = Object.entries(difficultyFilters)
      .filter(([_, isActive]) => isActive)
      .map(([difficulty]) => difficulty);
      
    if (activeDifficultyFilters.length) {
      filtered = filtered.filter(q => activeDifficultyFilters.includes(q.difficulty));
    }
    
    setFilteredQuestions(filtered);
  }, [searchQuery, topicFilters, difficultyFilters, questions]);
  
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
  
  // Toggle topic filter
  const toggleTopicFilter = (topic: string) => {
    setTopicFilters(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };
  
  // Toggle difficulty filter
  const toggleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilters(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    
    // Reset topic filters
    const resetTopics: TopicFilter = {};
    Object.keys(topicFilters).forEach(topic => {
      resetTopics[topic] = false;
    });
    setTopicFilters(resetTopics);
    
    // Reset difficulty filters
    setDifficultyFilters({
      'Easy': false,
      'Medium': false,
      'Hard': false
    });
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
  
  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <PageHeader 
          title="Create Custom Test" 
          subtitle="Select questions and set test parameters"
        />
        <div className="container-custom py-8">
          <Card className="bg-secondary border-gray-800">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-64 bg-gray-700" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40 bg-gray-700 mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <PageHeader 
        title="Create Custom Test" 
        subtitle="Select questions and set test parameters"
      />
      
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Test details */}
          <div className="lg:col-span-1">
            <Card className="bg-secondary border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
                <CardDescription>Configure your custom test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="test-title">Test Title</Label>
                  <Input 
                    id="test-title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter test name"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="test-desc">Description (Optional)</Label>
                  <Textarea 
                    id="test-desc" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the test"
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
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
                  <Label htmlFor="publish-switch">Publish Immediately</Label>
                  <Switch 
                    id="publish-switch" 
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Selected Questions</Label>
                    <span className="text-sm font-medium">{selectedQuestions.length}</span>
                  </div>
                  
                  {selectedQuestions.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <p>No questions selected yet</p>
                      <p className="text-sm mt-1">Select questions from the question pool</p>
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
                              {question.topic} • {question.difficulty}
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
                  {saving ? "Saving..." : "Save Custom Test"}
                </Button>
                
                {!title.trim() && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Please enter a title for your test</span>
                  </div>
                )}
                
                {selectedQuestions.length === 0 && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Please select at least one question</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right side: Question selection */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger 
                  value="question-pool" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Question Pool
                </TabsTrigger>
                <TabsTrigger 
                  value="selected-questions" 
                  className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                >
                  Selected Questions ({selectedQuestions.length})
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
                            placeholder="Search questions by text, number, or topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={resetFilters}
                        className="border-gray-700"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Filter by Topic</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {Object.keys(topicFilters).map(topic => (
                            <div key={topic} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`topic-${topic}`} 
                                checked={topicFilters[topic]}
                                onCheckedChange={() => toggleTopicFilter(topic)}
                              />
                              <Label htmlFor={`topic-${topic}`} className="cursor-pointer text-sm">
                                {topic}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Filter by Difficulty</Label>
                        <div className="space-y-2">
                          {Object.keys(difficultyFilters).map(difficulty => (
                            <div key={difficulty} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`difficulty-${difficulty}`} 
                                checked={difficultyFilters[difficulty]}
                                onCheckedChange={() => toggleDifficultyFilter(difficulty)}
                              />
                              <Label htmlFor={`difficulty-${difficulty}`} className="cursor-pointer text-sm">
                                {difficulty}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Available Questions</h3>
                        <span className="text-sm text-gray-400">
                          {filteredQuestions.length} questions found
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {filteredQuestions.length === 0 ? (
                          <div className="text-center py-10 text-gray-400">
                            <p>No questions match your filters</p>
                            <p className="text-sm mt-1">Try changing your search or filters</p>
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
                                        #{question.question_number}
                                      </span>
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        {question.topic}
                                      </span>
                                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        {question.difficulty}
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
                                        Selected
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={16} className="mr-2" />
                                        Select
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
                                      alt="Question visual" 
                                      className="w-full h-full object-contain"
                                    />
                                  </AspectRatio>
                                </CardContent>
                              )}
                              
                              <CardContent className="p-4 pt-0">
                                <h4 className="font-medium text-sm mb-2">Answers:</h4>
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
                    <CardTitle>Selected Questions</CardTitle>
                    <CardDescription>
                      {selectedQuestions.length} questions selected for this test
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {selectedQuestions.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <p>No questions selected yet</p>
                        <p className="text-sm mt-1">Go to Question Pool to select questions</p>
                        <Button 
                          className="mt-4 bg-lider-red hover:bg-red-700"
                          onClick={() => setActiveTab('question-pool')}
                        >
                          Select Questions
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
                                        #{question.question_number}
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
                                  Remove
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3">
                              <p className="text-sm mb-2">{question.text}</p>
                              {question.image && (
                                <AspectRatio ratio={16 / 9} className="bg-gray-950 rounded-md overflow-hidden mb-2 max-w-xs">
                                  <img 
                                    src={question.image} 
                                    alt="Question visual" 
                                    className="w-full h-full object-contain"
                                  />
                                </AspectRatio>
                              )}
                              <div className="text-xs text-gray-400">
                                {question.answers.length} answers • {question.answers.find(a => a.is_correct) ? "Single correct answer" : "Multiple correct answers"}
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
                      {saving ? "Saving..." : "Save Custom Test"}
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
