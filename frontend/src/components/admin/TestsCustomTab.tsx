
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye, User, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Mock data for custom tests
const mockCustomTests = [
  {
    id: "ct1",
    title: "Final Preparation Test",
    description: "Comprehensive review of all material before the exam",
    created_by: {
      id: "i2",
      name: "Emily Williams",
      role: "instructor"
    },
    created_at: "2025-04-18T11:45:00Z",
    question_count: 40,
    time_limit: 35,
    is_published: true,
    student_count: 8,
    student_performance: [
      {
        student_id: "s1",
        student_name: "Alex Johnson",
        date_taken: "2025-05-12T14:30:00Z",
        score: 90,
        time_spent: 1830, // in seconds
        status: "passed"
      },
      {
        student_id: "s2",
        student_name: "Jamie Smith",
        date_taken: "2025-05-11T10:15:00Z",
        score: 75,
        time_spent: 2100, // in seconds
        status: "failed"
      },
      {
        student_id: "s3",
        student_name: "Taylor Brown",
        date_taken: "2025-05-10T16:45:00Z",
        score: 95,
        time_spent: 1965, // in seconds
        status: "passed"
      }
    ]
  },
  {
    id: "ct2",
    title: "Quick Assessment",
    description: "Brief test to check understanding of basic concepts",
    created_by: {
      id: "i2",
      name: "Emily Williams",
      role: "instructor"
    },
    created_at: "2025-04-20T16:30:00Z",
    question_count: 10,
    time_limit: 8,
    is_published: true,
    student_count: 12,
    student_performance: [
      {
        student_id: "s1",
        student_name: "Alex Johnson",
        date_taken: "2025-05-12T09:20:00Z",
        score: 100,
        time_spent: 450, // in seconds
        status: "passed"
      },
      {
        student_id: "s4",
        student_name: "Jordan Lee",
        date_taken: "2025-05-11T11:30:00Z",
        score: 90,
        time_spent: 390, // in seconds
        status: "passed"
      }
    ]
  },
  {
    id: "ct3",
    title: "Road Signs Special Test",
    description: "Focused test on identifying and understanding road signs",
    created_by: {
      id: "i1",
      name: "John Doe",
      role: "instructor"
    },
    created_at: "2025-04-22T10:15:00Z",
    question_count: 25,
    time_limit: 20,
    is_published: true,
    student_count: 5,
    student_performance: [
      {
        student_id: "s2",
        student_name: "Jamie Smith",
        date_taken: "2025-05-10T14:15:00Z",
        score: 88,
        time_spent: 1140, // in seconds
        status: "passed"
      },
      {
        student_id: "s5",
        student_name: "Casey Wong",
        date_taken: "2025-05-09T15:45:00Z",
        score: 92,
        time_spent: 1020, // in seconds
        status: "passed"
      }
    ]
  }
];

const TestsCustomTab = () => {
  const { toast } = useToast();
  const [customTests, setCustomTests] = useState(mockCustomTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  
  // Filter tests based on search query
  const filteredTests = customTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.created_by.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };
  
  // Format time for display (e.g., 1830 seconds -> 30:30)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Toggle test published status
  const togglePublishedStatus = (testId: string) => {
    setCustomTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, is_published: !test.is_published }
          : test
      )
    );
    
    const test = customTests.find(t => t.id === testId);
    if (test) {
      toast({
        title: test.is_published ? "Test Unpublished" : "Test Published",
        description: `"${test.title}" has been ${test.is_published ? "unpublished" : "published"}.`
      });
    }
  };
  
  // View test performance
  const handleViewPerformance = (test: any) => {
    setSelectedTest(test);
    setIsPerformanceDialogOpen(true);
  };
  
  // View test details
  const handleViewTest = (test: any) => {
    toast({
      title: "View Test",
      description: `Viewing details for test "${test.title}"`
    });
  };
  
  // Edit test
  const handleEditTest = (test: any) => {
    toast({
      title: "Edit Test",
      description: `Editing test "${test.title}"`
    });
  };
  
  // Delete test
  const handleDeleteTest = (test: any) => {
    setSelectedTest(test);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm delete
  const confirmDelete = () => {
    if (selectedTest) {
      setCustomTests(prev => prev.filter(t => t.id !== selectedTest.id));
      toast({
        title: "Test Deleted",
        description: `"${selectedTest.title}" has been deleted.`
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <Card className="bg-secondary border-gray-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Custom Tests</CardTitle>
            <CardDescription>
              View and manage custom tests created by instructors
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tests by title or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="hover:bg-gray-800/80">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Instructor</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Questions</TableHead>
                <TableHead className="text-gray-300">Time Limit</TableHead>
                <TableHead className="text-gray-300">Students</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                    No custom tests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test) => (
                  <TableRow key={test.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate">
                        {test.title}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {test.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {test.created_by.name}
                    </TableCell>
                    <TableCell>
                      {formatDate(test.created_at)}
                    </TableCell>
                    <TableCell>
                      {test.question_count}
                    </TableCell>
                    <TableCell>
                      {test.time_limit} min
                    </TableCell>
                    <TableCell>
                      {test.student_count}
                    </TableCell>
                    <TableCell>
                      {test.is_published ? (
                        <Badge className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-400">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTest(test)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTest(test)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublishedStatus(test.id)}
                          className="h-8 w-8 p-0"
                        >
                          {test.is_published ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        {test.student_count > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPerformance(test)}
                            className="h-8 w-8 p-0"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTest(test)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Student Performance Dialog */}
      <Dialog open={isPerformanceDialogOpen} onOpenChange={setIsPerformanceDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Student Performance: {selectedTest?.title}</DialogTitle>
            <DialogDescription>
              View detailed student results for this test
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Questions</p>
                  <p className="font-medium">{selectedTest.question_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Limit</p>
                  <p className="font-medium">{selectedTest.time_limit} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students Taken</p>
                  <p className="font-medium">{selectedTest.student_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="font-medium">{selectedTest.created_by.name}</p>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800/80">
                      <TableHead className="text-gray-300">Student</TableHead>
                      <TableHead className="text-gray-300">Date Taken</TableHead>
                      <TableHead className="text-gray-300">Score</TableHead>
                      <TableHead className="text-gray-300">Time Spent</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTest.student_performance.map((performance: any) => (
                      <TableRow key={performance.student_id} className="hover:bg-gray-800/50">
                        <TableCell className="font-medium">
                          {performance.student_name}
                        </TableCell>
                        <TableCell>
                          {formatDate(performance.date_taken)}
                        </TableCell>
                        <TableCell>
                          {performance.score}%
                        </TableCell>
                        <TableCell>
                          {formatTime(performance.time_spent)}
                        </TableCell>
                        <TableCell>
                          {performance.status === "passed" ? (
                            <Badge className="bg-green-600">Passed</Badge>
                          ) : (
                            <Badge className="bg-red-600">Failed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsPerformanceDialogOpen(false)}
              className="bg-lider-red hover:bg-red-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete "{selectedTest?.title}" and all associated student results.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TestsCustomTab;
