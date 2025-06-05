
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Calendar, Clock, Trophy, ArrowUpDown, ChevronDown, Eye, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Mock API functions - replace with actual API calls
const fetchTestDetails = async (testId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: testId,
    title: "Pre-exam Practice Test",
    description: "A comprehensive test covering all major topics",
    created_at: "2025-04-05",
    created_by: "John Doe",
    question_count: 20,
    time_limit: 25,
    status: "active"
  };
};

const fetchStudentPerformance = async (testId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "1",
      student: {
        id: "s1",
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?img=1",
        email: "emma.w@example.com"
      },
      score: 85,
      total_questions: 20,
      correct_answers: 17,
      wrong_answers: 3,
      completed_at: "2025-05-10T14:30:00Z",
      time_spent: 1200, // in seconds
      mistakes: [
        { question_id: 3577, question_text: "When approaching a pedestrian crossing with no traffic lights, you should:" },
        { question_id: 3579, question_text: "What is the speed limit in a residential area unless otherwise posted?" },
        { question_id: 3580, question_text: "When making a right turn, you should:" }
      ]
    },
    {
      id: "2",
      student: {
        id: "s2",
        name: "Michael Brown",
        avatar: "https://i.pravatar.cc/150?img=11",
        email: "michael.b@example.com"
      },
      score: 90,
      total_questions: 20,
      correct_answers: 18,
      wrong_answers: 2,
      completed_at: "2025-05-10T15:45:00Z",
      time_spent: 1350, // in seconds
      mistakes: [
        { question_id: 3578, question_text: "What is the proper action when you see this road sign?" },
        { question_id: 3579, question_text: "What is the speed limit in a residential area unless otherwise posted?" }
      ]
    },
    {
      id: "3",
      student: {
        id: "s3",
        name: "Sophia Garcia",
        avatar: "https://i.pravatar.cc/150?img=5",
        email: "sophia.g@example.com"
      },
      score: 95,
      total_questions: 20,
      correct_answers: 19,
      wrong_answers: 1,
      completed_at: "2025-05-11T09:20:00Z",
      time_spent: 1100, // in seconds
      mistakes: [
        { question_id: 3579, question_text: "What is the speed limit in a residential area unless otherwise posted?" }
      ]
    },
    {
      id: "4",
      student: {
        id: "s4",
        name: "James Johnson",
        avatar: "https://i.pravatar.cc/150?img=12",
        email: "james.j@example.com"
      },
      score: 80,
      total_questions: 20,
      correct_answers: 16,
      wrong_answers: 4,
      completed_at: "2025-05-11T10:15:00Z",
      time_spent: 1450, // in seconds
      mistakes: [
        { question_id: 3577, question_text: "When approaching a pedestrian crossing with no traffic lights, you should:" },
        { question_id: 3578, question_text: "What is the proper action when you see this road sign?" },
        { question_id: 3579, question_text: "What is the speed limit in a residential area unless otherwise posted?" },
        { question_id: 3580, question_text: "When making a right turn, you should:" }
      ]
    },
    {
      id: "5",
      student: {
        id: "s5",
        name: "Olivia Smith",
        avatar: "https://i.pravatar.cc/150?img=3",
        email: "olivia.s@example.com"
      },
      score: 100,
      total_questions: 20,
      correct_answers: 20,
      wrong_answers: 0,
      completed_at: "2025-05-11T11:30:00Z",
      time_spent: 1250, // in seconds
      mistakes: []
    }
  ];
};

interface TestDetails {
  id: string;
  title: string;
  description: string;
  created_at: string;
  created_by: string;
  question_count: number;
  time_limit: number;
  status: string;
}

interface StudentMistake {
  question_id: number;
  question_text: string;
}

interface StudentPerformance {
  id: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  completed_at: string;
  time_spent: number; // in seconds
  mistakes: StudentMistake[];
}

const TestPerformance = () => {
  const { testId } = useParams<{ testId: string }>();
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [filteredData, setFilteredData] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'completed_at', direction: 'desc' });
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Load test details and performance data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Fetch test details and student performance data
        const details = await fetchTestDetails(testId || '');
        const performance = await fetchStudentPerformance(testId || '');
        
        setTestDetails(details);
        setPerformanceData(performance);
        setFilteredData(performance);
      } catch (error) {
        console.error('Error loading test performance data:', error);
        toast({
          title: "Error",
          description: "Failed to load test performance data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (authState.user && (authState.user.role === 'instructor' || authState.user.role === 'admin')) {
      loadData();
    } else if (!authState.isLoading && (!authState.user || (authState.user.role !== 'instructor' && authState.user.role !== 'admin'))) {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive"
      });
    }
  }, [authState.isLoading, authState.user, testId, navigate, toast]);
  
  // Filter performance data based on search query
  useEffect(() => {
    if (!performanceData.length) return;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = performanceData.filter(item => 
        item.student.name.toLowerCase().includes(query) ||
        item.student.email.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(performanceData);
    }
  }, [searchQuery, performanceData]);
  
  // Sort performance data
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredData].sort((a, b) => {
      // Handle nested properties
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (direction === 'asc') {
          // @ts-ignore
          return a[parent][child].localeCompare(b[parent][child]);
        } else {
          // @ts-ignore
          return b[parent][child].localeCompare(a[parent][child]);
        }
      }
      
      // Handle date sorting
      if (key === 'completed_at') {
        if (direction === 'asc') {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        } else {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
      }
      
      // Handle numeric sorting
      if (typeof a[key as keyof StudentPerformance] === 'number') {
        if (direction === 'asc') {
          return (a[key as keyof StudentPerformance] as number) - (b[key as keyof StudentPerformance] as number);
        } else {
          return (b[key as keyof StudentPerformance] as number) - (a[key as keyof StudentPerformance] as number);
        }
      }
      
      // Handle string sorting
      if (direction === 'asc') {
        return String(a[key as keyof StudentPerformance]).localeCompare(String(b[key as keyof StudentPerformance]));
      } else {
        return String(b[key as keyof StudentPerformance]).localeCompare(String(a[key as keyof StudentPerformance]));
      }
    });
    
    setFilteredData(sortedData);
  };
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // View student details
  const handleViewStudent = (student: StudentPerformance) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };
  
  // Handle export report
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly."
    });
    
    // In a real implementation, this would trigger an actual file download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Student performance report has been downloaded."
      });
    }, 2000);
  };
  
  // Calculate class average
  const calculateClassAverage = () => {
    if (!performanceData.length) return 0;
    
    const totalScore = performanceData.reduce((sum, item) => sum + item.score, 0);
    return Math.round(totalScore / performanceData.length);
  };
  
  // Calculate pass rate
  const calculatePassRate = () => {
    if (!performanceData.length) return 0;
    
    const passCount = performanceData.filter(item => item.score >= 70).length;
    return Math.round((passCount / performanceData.length) * 100);
  };
  
  // Get sorted column name for UI indication
  const getSortIndicator = (column: string) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return null;
  };
  
  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 70) return "bg-blue-600";
    if (score >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };
  
  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <PageHeader 
          title="Loading Test Performance" 
          subtitle="Please wait while we load student performance data"
        />
        <div className="container-custom py-8">
          <Card className="bg-secondary border-gray-800 mb-6">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-64 bg-gray-700" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-40 bg-gray-700 mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full bg-gray-700" />
                <Skeleton className="h-24 w-full bg-gray-700" />
                <Skeleton className="h-24 w-full bg-gray-700" />
                <Skeleton className="h-24 w-full bg-gray-700" />
              </div>
              <Skeleton className="h-64 w-full bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  if (!testDetails) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl mb-4">Test not found</h2>
          <p className="text-gray-400 mb-6">
            The test performance data you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => navigate('/instructor/tests')}
            className="bg-lider-red hover:bg-red-700"
          >
            Return to Tests
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <PageHeader 
        title={testDetails.title}
        subtitle="Student Performance Analysis"
      />
      
      <div className="container-custom py-8">
        {/* Test details */}
        <Card className="bg-secondary border-gray-800 mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{testDetails.title}</CardTitle>
                <CardDescription className="mt-1">
                  {testDetails.description || "No description available"}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleExport}
              >
                <Download size={16} />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400 text-sm mb-1 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Created On
                </div>
                <div className="text-lg font-bold">{new Date(testDetails.created_at).toLocaleDateString()}</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400 text-sm mb-1 flex items-center">
                  <Trophy size={14} className="mr-2" />
                  Class Average
                </div>
                <div className="text-lg font-bold">{calculateClassAverage()}%</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400 text-sm mb-1 flex items-center">
                  <Clock size={14} className="mr-2" />
                  Pass Rate
                </div>
                <div className="text-lg font-bold">{calculatePassRate()}%</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Students Completed</div>
                <div className="text-lg font-bold">{performanceData.length}</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="flex w-full md:w-1/2 justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700">
                      Sort By
                      <ChevronDown size={16} className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-700">
                    <DropdownMenuItem onClick={() => handleSort('student.name')}>
                      Student Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('score')}>
                      Score
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('completed_at')}>
                      Completion Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('time_spent')}>
                      Time Spent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow className="hover:bg-gray-800/80">
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-bold text-gray-300 hover:text-white"
                        onClick={() => handleSort('student.name')}
                      >
                        Student {getSortIndicator('student.name')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-bold text-gray-300 hover:text-white"
                        onClick={() => handleSort('score')}
                      >
                        Score {getSortIndicator('score')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-bold text-gray-300 hover:text-white"
                        onClick={() => handleSort('completed_at')}
                      >
                        Completed {getSortIndicator('completed_at')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-bold text-gray-300 hover:text-white"
                        onClick={() => handleSort('time_spent')}
                      >
                        Time Spent {getSortIndicator('time_spent')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">Mistakes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        No student performance data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={student.student.avatar} alt={student.student.name} />
                              <AvatarFallback>{student.student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{student.student.name}</div>
                              <div className="text-xs text-gray-400">{student.student.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getScoreBadgeColor(student.score)}`}>
                            {student.score}%
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">
                            {student.correct_answers}/{student.total_questions} correct
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(student.completed_at)}
                        </TableCell>
                        <TableCell>
                          {formatTime(student.time_spent)}
                          <div className="text-xs text-gray-400">
                            {testDetails.time_limit 
                              ? `${Math.round((student.time_spent / (testDetails.time_limit * 60)) * 100)}% of limit`
                              : "No time limit"
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">{student.mistakes.length}</span>
                            {student.mistakes.length === 0 ? (
                              <Badge className="bg-green-700 ml-2 text-xs">Perfect</Badge>
                            ) : (
                              student.mistakes.length > 0 && (
                                <Badge className="bg-amber-700 ml-2 text-xs">
                                  {student.wrong_answers} wrong
                                </Badge>
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Student details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl mb-2">Student Performance Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information about {selectedStudent?.student.name}'s test performance
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarImage src={selectedStudent.student.avatar} alt={selectedStudent.student.name} />
                      <AvatarFallback className="text-2xl">{selectedStudent.student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold">{selectedStudent.student.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedStudent.student.email}</p>
                    
                    <div className="mt-6 w-full">
                      <div className="bg-gray-800 p-4 rounded-lg text-center mb-2">
                        <div className="text-3xl font-bold mb-1">{selectedStudent.score}%</div>
                        <div className="text-sm text-gray-400">Overall Score</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-400">{selectedStudent.correct_answers}</div>
                          <div className="text-xs text-gray-400">Correct</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-red-400">{selectedStudent.wrong_answers}</div>
                          <div className="text-xs text-gray-400">Wrong</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h4 className="font-medium text-gray-300 mb-3">Test Details</h4>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Test Completed:</span>
                      <span>{formatDate(selectedStudent.completed_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Spent:</span>
                      <span>{formatTime(selectedStudent.time_spent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Questions Answered:</span>
                      <span>{selectedStudent.total_questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pass Status:</span>
                      <span>
                        {selectedStudent.score >= 70 ? (
                          <Badge className="bg-green-700">Pass</Badge>
                        ) : (
                          <Badge className="bg-red-700">Fail</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-300 mb-3 mt-6">Mistakes ({selectedStudent.mistakes.length})</h4>
                  
                  {selectedStudent.mistakes.length === 0 ? (
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-green-400">Perfect score! No mistakes.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {selectedStudent.mistakes.map((mistake, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-start">
                            <div className="bg-lider-red/20 text-lider-red border border-lider-red/20 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="text-sm">{mistake.question_text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TestPerformance;
