
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock test results data (extended)
const mockTestResults = [
  {
    id: "r1",
    date: "2025-05-12T14:30:00Z",
    score: 18,
    total: 20,
    time_spent: 870, // 14m 30s in seconds
    status: "passed",
    type: "random"
  },
  {
    id: "r2",
    date: "2025-05-10T17:10:00Z",
    score: 15,
    total: 20,
    time_spent: 1030,
    status: "failed",
    type: "topic",
    topic_name: "Road Signs"
  },
  {
    id: "r3",
    date: "2025-05-07T13:45:00Z",
    score: 20,
    total: 20,
    time_spent: 825,
    status: "passed",
    type: "random"
  },
  {
    id: "r4",
    date: "2025-05-05T09:20:00Z",
    score: 17,
    total: 20,
    time_spent: 950,
    status: "passed",
    type: "custom",
    test_name: "Pre-exam Practice"
  },
  {
    id: "r5",
    date: "2025-05-03T11:15:00Z",
    score: 14,
    total: 20,
    time_spent: 1120,
    status: "failed",
    type: "random"
  },
  {
    id: "r6",
    date: "2025-05-01T16:40:00Z",
    score: 19,
    total: 20,
    time_spent: 890,
    status: "passed",
    type: "topic",
    topic_name: "Traffic Rules"
  },
  {
    id: "r7",
    date: "2025-04-28T10:05:00Z",
    score: 16,
    total: 20,
    time_spent: 930,
    status: "passed",
    type: "random"
  },
  {
    id: "r8",
    date: "2025-04-25T14:50:00Z",
    score: 13,
    total: 20,
    time_spent: 980,
    status: "failed",
    type: "custom",
    test_name: "Road Signs Quiz"
  },
  {
    id: "r9",
    date: "2025-04-22T09:30:00Z",
    score: 18,
    total: 20,
    time_spent: 845,
    status: "passed",
    type: "topic",
    topic_name: "Parking Rules"
  },
  {
    id: "r10",
    date: "2025-04-20T13:25:00Z",
    score: 12,
    total: 20,
    time_spent: 1050,
    status: "failed",
    type: "random"
  },
  {
    id: "r11",
    date: "2025-04-18T15:10:00Z",
    score: 17,
    total: 20,
    time_spent: 920,
    status: "passed",
    type: "topic",
    topic_name: "Highway Driving"
  },
  {
    id: "r12",
    date: "2025-04-15T11:40:00Z",
    score: 19,
    total: 20,
    time_spent: 880,
    status: "passed",
    type: "random"
  }
];

const TestHistory = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(mockTestResults.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = mockTestResults.slice(indexOfFirstResult, indexOfLastResult);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };
  
  // Format time for display (seconds -> minutes:seconds)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Handle viewing test details
  const handleViewTestResult = (resultId: string) => {
    navigate(`/tests/results/${resultId}`);
  };
  
  // Handle going back to tests page
  const handleBack = () => {
    navigate('/tests');
  };
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [authState.isLoading, authState.user, navigate]);
  
  // Test type display
  const getTestTypeDisplay = (result: any) => {
    if (result.type === "random") {
      return "Random Test";
    } else if (result.type === "topic") {
      return `Topic: ${result.topic_name}`;
    } else if (result.type === "custom") {
      return `Custom: ${result.test_name}`;
    }
    return "Unknown";
  };
  
  // Loading state
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
      <PageHeader 
        title="Test History" 
        subtitle="Review all your previous test attempts"
      />
      
      <div className="container-custom py-8">
        <Button 
          variant="outline" 
          className="mb-6 border-gray-600"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>
        
        <Card className="bg-secondary border-gray-800">
          <CardContent className="p-6">
            {mockTestResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You haven't taken any tests yet.</p>
                <Button onClick={handleBack}>Go to Tests</Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(result.date)}
                          </div>
                        </TableCell>
                        <TableCell>{getTestTypeDisplay(result)}</TableCell>
                        <TableCell>{result.score}/{result.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {formatTime(result.time_spent)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={result.status === "passed" ? "bg-green-600" : "bg-red-600"}>
                            {result.status === "passed" ? "Passed" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTestResult(result.id)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className="border-gray-600"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button 
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handlePageChange(i + 1)}
                          className={currentPage === i + 1 
                            ? "bg-lider-red hover:bg-red-700" 
                            : "border-gray-600"
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className="border-gray-600"
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TestHistory;
