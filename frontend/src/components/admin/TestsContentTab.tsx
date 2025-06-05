
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
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Using the same mock data from AdminTestManagement
const mockTests = [
  {
    id: "101",
    title: "Pre-exam Practice Test",
    description: "A comprehensive test covering all major topics",
    type: "custom" as const,
    created_by: {
      id: "i1",
      name: "John Doe",
      role: "instructor"
    },
    created_at: "2025-04-05T10:30:00Z",
    question_count: 30,
    time_limit: 25,
    is_published: true,
    student_count: 15,
    pass_rate: 80
  },
  {
    id: "102",
    title: "Road Signs Quiz",
    description: "Special focus on recognizing and understanding road signs",
    type: "custom" as const,
    created_by: {
      id: "i1",
      name: "John Doe",
      role: "instructor"
    },
    created_at: "2025-04-10T14:20:00Z",
    question_count: 15,
    time_limit: 12,
    is_published: true,
    student_count: 12,
    pass_rate: 75
  },
  {
    id: "103",
    title: "Advanced Driving Scenarios",
    description: "Complex scenarios for experienced drivers",
    type: "custom" as const,
    created_by: {
      id: "i1",
      name: "John Doe",
      role: "instructor"
    },
    created_at: "2025-04-15T09:15:00Z",
    question_count: 20,
    time_limit: 18,
    is_published: false,
    student_count: 0,
    pass_rate: 0
  }
];

const TestsContentTab = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState(mockTests);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Filter tests based on search query
  const filteredTests = tests.filter(test => 
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
  
  // Toggle test published status
  const togglePublishedStatus = (testId: string) => {
    setTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, is_published: !test.is_published }
          : test
      )
    );
    
    const test = tests.find(t => t.id === testId);
    if (test) {
      toast({
        title: test.is_published ? "Test Unpublished" : "Test Published",
        description: `"${test.title}" has been ${test.is_published ? "unpublished" : "published"}.`
      });
    }
  };
  
  // Handle test view action
  const handleViewTest = (test: any) => {
    // In a real application, this would navigate to a test detail view
    toast({
      title: "View Test",
      description: `Viewing details for "${test.title}"`
    });
  };
  
  // Handle test edit action
  const handleEditTest = (test: any) => {
    // In a real application, this would navigate to a test edit form
    toast({
      title: "Edit Test",
      description: `Editing "${test.title}"`
    });
  };
  
  // Handle test delete action
  const handleDeleteTest = (test: any) => {
    setSelectedTest(test);
    setIsDeleteDialogOpen(true);
  };
  
  // Confirm delete test
  const confirmDelete = () => {
    if (selectedTest) {
      setTests(prev => prev.filter(t => t.id !== selectedTest.id));
      toast({
        title: "Test Deleted",
        description: `"${selectedTest.title}" has been deleted.`
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Card className="bg-secondary border-gray-800">
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-64 bg-gray-700" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-40 bg-gray-700 mt-2" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-12 w-full bg-gray-700" />
          <Skeleton className="h-64 w-full bg-gray-700" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-secondary border-gray-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Custom Tests</CardTitle>
            <CardDescription>
              Manage tests created by instructors
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              // In a real application, this would navigate to a test creation form
              toast({
                title: "Create Test",
                description: "You would be directed to the test creation page"
              });
            }}
            className="bg-lider-red hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
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
                <TableHead className="text-gray-300">Creator</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Questions</TableHead>
                <TableHead className="text-gray-300">Students</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No tests found
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
                      <div>
                        {test.student_count}
                        {test.student_count > 0 && (
                          <div className="text-xs text-gray-400">
                            {test.pass_rate}% pass rate
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {test.is_published ? (
                        <Badge className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-400">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-900 border-gray-700" align="end">
                            <DropdownMenuItem onClick={() => handleViewTest(test)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTest(test)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Test</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublishedStatus(test.id)}>
                              {test.is_published ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Unpublish</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Publish</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTest(test)} className="text-red-500 focus:text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete "{selectedTest?.title}" and all associated data.
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

export default TestsContentTab;
