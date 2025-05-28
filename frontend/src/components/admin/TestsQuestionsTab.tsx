
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, Image } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for questions
const mockQuestions = [
  {
    id: "101",
    section: "Road Signs",
    ticket_number: "001",
    question_number: "1",
    text: "What does this traffic sign indicate?",
    reply_text: "This traffic sign indicates a lane designated for vehicles and cyclists.",
    image: "https://vodiy.ua/media/questions/1-35.jpg",
    answers: [
      {
        id: "1001",
        text: "A road with a designated lane for vehicles and cyclists to follow a specific route.",
        is_correct: true
      },
      {
        id: "1002",
        text: "A road where cyclists are not allowed.",
        is_correct: false
      },
      {
        id: "1003",
        text: "A warning that there may be cyclists on the road.",
        is_correct: false
      },
      {
        id: "1004",
        text: "A dedicated bike path separate from the road.",
        is_correct: false
      }
    ]
  },
  {
    id: "102",
    section: "Traffic Rules",
    ticket_number: "001",
    question_number: "2",
    text: "When approaching a pedestrian crossing with no traffic lights, you should:",
    reply_text: "You should slow down and be prepared to stop for pedestrians when approaching a pedestrian crossing with no traffic lights.",
    image: null,
    answers: [
      {
        id: "1005",
        text: "Speed up to cross quickly.",
        is_correct: false
      },
      {
        id: "1006",
        text: "Maintain your speed but be prepared to stop.",
        is_correct: false
      },
      {
        id: "1007",
        text: "Slow down and be prepared to stop for pedestrians.",
        is_correct: true
      },
      {
        id: "1008",
        text: "Stop only if there are pedestrians already crossing.",
        is_correct: false
      }
    ]
  },
  {
    id: "103",
    section: "Road Signs",
    ticket_number: "001",
    question_number: "3",
    text: "What is the proper action when you see this road sign?",
    reply_text: "When you see a stop sign, you must come to a complete stop and proceed only when it is safe to do so.",
    image: "https://vodiy.ua/media/questions/1-35.jpg",
    answers: [
      {
        id: "1009",
        text: "Slow down and proceed if the way is clear.",
        is_correct: false
      },
      {
        id: "1010",
        text: "Come to a complete stop and proceed only when safe.",
        is_correct: true
      },
      {
        id: "1011",
        text: "Yield to traffic on the main road.",
        is_correct: false
      },
      {
        id: "1012",
        text: "Stop only if there is traffic approaching.",
        is_correct: false
      }
    ]
  }
];

const TestsQuestionsTab = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    section: "",
    ticket_number: "",
    question_number: "",
    text: "",
    reply_text: "",
    image: null,
    answers: [
      { id: "new-1", text: "", is_correct: true },
      { id: "new-2", text: "", is_correct: false },
      { id: "new-3", text: "", is_correct: false },
      { id: "new-4", text: "", is_correct: false }
    ]
  });

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => 
    question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.question_number.includes(searchQuery) ||
    question.ticket_number.includes(searchQuery)
  );
  
  // Question view/edit/delete handlers
  const handleQuestionView = (question: any) => {
    setSelectedQuestion(question);
    setIsDetailDialogOpen(true);
  };
  
  const handleQuestionEdit = (question: any) => {
    setSelectedQuestion({ ...question });
    setIsEditDialogOpen(true);
  };
  
  const handleQuestionDelete = (question: any) => {
    setSelectedQuestion(question);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle add new question
  const handleAddQuestion = () => {
    setIsAddDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedQuestion) {
      setQuestions(prev => prev.filter(q => q.id !== selectedQuestion.id));
      toast({
        title: "Question Deleted",
        description: `Question #${selectedQuestion.question_number} has been deleted.`
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Handle answer changes
  const handleAnswerChange = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    if (selectedQuestion) {
      const newAnswers = [...selectedQuestion.answers];
      // If setting a new correct answer, make others false
      if (field === 'is_correct' && value === true) {
        newAnswers.forEach((answer, idx) => {
          if (idx !== index) answer.is_correct = false;
        });
      }
      newAnswers[index][field] = value;
      setSelectedQuestion({
        ...selectedQuestion,
        answers: newAnswers
      });
    }
  };
  
  const handleQuestionSave = () => {
    if (selectedQuestion) {
      // Ensure one answer is marked as correct
      const hasCorrectAnswer = selectedQuestion.answers.some(answer => answer.is_correct);
      
      if (!hasCorrectAnswer) {
        toast({
          title: "Error",
          description: "At least one answer must be marked as correct",
          variant: "destructive"
        });
        return;
      }
      
      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestion.id ? { ...selectedQuestion } : q
      ));
      
      toast({
        title: "Question Updated",
        description: `Question #${selectedQuestion.question_number} has been updated.`
      });
      
      setIsEditDialogOpen(false);
    }
  };
  
  const handleNewQuestionSave = () => {
    // Validate question fields
    if (!newQuestion.text || !newQuestion.section || !newQuestion.ticket_number || !newQuestion.question_number) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure at least one correct answer
    const hasCorrectAnswer = newQuestion.answers.some(answer => answer.is_correct);
    if (!hasCorrectAnswer) {
      toast({
        title: "Error",
        description: "At least one answer must be marked as correct",
        variant: "destructive"
      });
      return;
    }
    
    // Create new question
    const newId = (parseInt(questions[questions.length - 1]?.id || "100") + 1).toString();
    
    // Create new answer IDs
    const newAnswers = newQuestion.answers.map((answer, index) => ({
      ...answer,
      id: `${parseInt(questions[questions.length - 1]?.answers[0]?.id || "1000") + index + 1}`
    }));
    
    const finalNewQuestion = {
      ...newQuestion,
      id: newId,
      answers: newAnswers
    };
    
    setQuestions(prev => [...prev, finalNewQuestion]);
    
    toast({
      title: "Question Created",
      description: `Question #${newQuestion.question_number} has been added.`
    });
    
    setIsAddDialogOpen(false);
  };
  
  return (
    <Card className="bg-secondary border-gray-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Manage all available questions and their answers
            </CardDescription>
          </div>
          <Button 
            onClick={handleAddQuestion}
            className="bg-lider-red hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Question
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions by text, section, or number..."
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
                <TableHead className="text-gray-300">Number</TableHead>
                <TableHead className="text-gray-300">Section</TableHead>
                <TableHead className="text-gray-300">Question</TableHead>
                <TableHead className="text-gray-300">Image</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((question) => (
                  <TableRow key={question.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium">
                      {question.ticket_number}/{question.question_number}
                    </TableCell>
                    <TableCell>
                      {question.section}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {question.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      {question.image ? (
                        <div className="flex items-center">
                          <Image className="h-4 w-4 text-blue-500 mr-1" />
                          <span>Yes</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuestionView(question)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuestionEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleQuestionDelete(question)}
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
      
      {/* View Question Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question {selectedQuestion?.question_number}</DialogTitle>
            <DialogDescription>
              Question details and answers
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-6 mt-2">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Question Text</h3>
                <p className="text-lg">{selectedQuestion.text}</p>
              </div>
              
              {selectedQuestion.image && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Image</h3>
                  <div className="max-w-full">
                    <img 
                      src={selectedQuestion.image} 
                      alt="Question" 
                      className="max-h-[290px] max-w-[516px] object-contain rounded-md"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Section</p>
                    <p>{selectedQuestion.section}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ticket Number</p>
                    <p>{selectedQuestion.ticket_number}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Reply Text</h3>
                <p>{selectedQuestion.reply_text || "Not provided"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Answers</h3>
                <div className="space-y-2">
                  {selectedQuestion.answers.map((answer: any) => (
                    <div 
                      key={answer.id} 
                      className={`p-3 rounded-lg ${answer.is_correct ? 'bg-green-900/20 border border-green-800/50' : 'bg-gray-800 border border-gray-700'}`}
                    >
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-3 ${answer.is_correct ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <div>{answer.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Modify question details and answers
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuestion && (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="answers" 
                    className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
                  >
                    Answers
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium mb-1">
                      Question Text
                    </label>
                    <Textarea
                      id="text"
                      value={selectedQuestion.text}
                      onChange={(e) => setSelectedQuestion({...selectedQuestion, text: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="section" className="block text-sm font-medium mb-1">
                        Section
                      </label>
                      <Input
                        id="section"
                        value={selectedQuestion.section}
                        onChange={(e) => setSelectedQuestion({...selectedQuestion, section: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ticket_number" className="block text-sm font-medium mb-1">
                        Ticket Number
                      </label>
                      <Input
                        id="ticket_number"
                        value={selectedQuestion.ticket_number}
                        onChange={(e) => setSelectedQuestion({...selectedQuestion, ticket_number: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="question_number" className="block text-sm font-medium mb-1">
                      Question Number
                    </label>
                    <Input
                      id="question_number"
                      value={selectedQuestion.question_number}
                      onChange={(e) => setSelectedQuestion({...selectedQuestion, question_number: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium mb-1">
                      Image URL (optional)
                    </label>
                    <Input
                      id="image"
                      value={selectedQuestion.image || ""}
                      onChange={(e) => setSelectedQuestion({...selectedQuestion, image: e.target.value || null})}
                      className="bg-gray-800 border-gray-700"
                    />
                    {selectedQuestion.image && (
                      <div className="mt-2">
                        <img 
                          src={selectedQuestion.image} 
                          alt="Preview" 
                          className="max-h-[200px] rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="reply_text" className="block text-sm font-medium mb-1">
                      Reply Text (explanation)
                    </label>
                    <Textarea
                      id="reply_text"
                      value={selectedQuestion.reply_text || ""}
                      onChange={(e) => setSelectedQuestion({...selectedQuestion, reply_text: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                      rows={3}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="answers" className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Edit answers and mark the correct one. Each question must have exactly one correct answer.
                  </p>
                  
                  {selectedQuestion.answers.map((answer: any, index: number) => (
                    <div key={answer.id} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`correct-${index}`}
                          checked={answer.is_correct}
                          onCheckedChange={(checked) => handleAnswerChange(index, 'is_correct', !!checked)}
                        />
                        <Label htmlFor={`correct-${index}`}>Correct Answer</Label>
                      </div>
                      
                      <div>
                        <label htmlFor={`answer-text-${index}`} className="block text-sm font-medium mb-1">
                          Answer Text
                        </label>
                        <Textarea
                          id={`answer-text-${index}`}
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleQuestionSave}
                  className="bg-lider-red hover:bg-red-700"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add New Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new question with answers
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="answers" 
                className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
              >
                Answers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div>
                <label htmlFor="new-text" className="block text-sm font-medium mb-1">
                  Question Text *
                </label>
                <Textarea
                  id="new-text"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-section" className="block text-sm font-medium mb-1">
                    Section *
                  </label>
                  <Input
                    id="new-section"
                    value={newQuestion.section}
                    onChange={(e) => setNewQuestion({...newQuestion, section: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g., Road Signs"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-ticket_number" className="block text-sm font-medium mb-1">
                    Ticket Number *
                  </label>
                  <Input
                    id="new-ticket_number"
                    value={newQuestion.ticket_number}
                    onChange={(e) => setNewQuestion({...newQuestion, ticket_number: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    placeholder="e.g., 001"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="new-question_number" className="block text-sm font-medium mb-1">
                  Question Number *
                </label>
                <Input
                  id="new-question_number"
                  value={newQuestion.question_number}
                  onChange={(e) => setNewQuestion({...newQuestion, question_number: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  placeholder="e.g., 4"
                />
              </div>
              
              <div>
                <label htmlFor="new-image" className="block text-sm font-medium mb-1">
                  Image URL (optional)
                </label>
                <Input
                  id="new-image"
                  value={newQuestion.image || ""}
                  onChange={(e) => setNewQuestion({...newQuestion, image: e.target.value || null})}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://example.com/image.jpg"
                />
                {newQuestion.image && (
                  <div className="mt-2">
                    <img 
                      src={newQuestion.image} 
                      alt="Preview" 
                      className="max-h-[200px] rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="new-reply_text" className="block text-sm font-medium mb-1">
                  Reply Text (explanation)
                </label>
                <Textarea
                  id="new-reply_text"
                  value={newQuestion.reply_text}
                  onChange={(e) => setNewQuestion({...newQuestion, reply_text: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                  placeholder="Explanation for the correct answer"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="answers" className="space-y-4">
              <p className="text-sm text-gray-400 mb-2">
                Add answers and mark the correct one. Each question must have exactly one correct answer.
              </p>
              
              {newQuestion.answers.map((answer, index) => (
                <div key={answer.id} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`new-correct-${index}`}
                      checked={answer.is_correct}
                      onCheckedChange={(checked) => {
                        const newAnswers = [...newQuestion.answers];
                        // If setting a new correct answer, make others false
                        if (checked) {
                          newAnswers.forEach((ans, idx) => {
                            if (idx !== index) ans.is_correct = false;
                          });
                        }
                        newAnswers[index].is_correct = !!checked;
                        setNewQuestion({...newQuestion, answers: newAnswers});
                      }}
                    />
                    <Label htmlFor={`new-correct-${index}`}>Correct Answer</Label>
                  </div>
                  
                  <div>
                    <label htmlFor={`new-answer-text-${index}`} className="block text-sm font-medium mb-1">
                      Answer Text
                    </label>
                    <Textarea
                      id={`new-answer-text-${index}`}
                      value={answer.text}
                      onChange={(e) => {
                        const newAnswers = [...newQuestion.answers];
                        newAnswers[index].text = e.target.value;
                        setNewQuestion({...newQuestion, answers: newAnswers});
                      }}
                      className="bg-gray-800 border-gray-700"
                      rows={2}
                      placeholder="Enter answer text"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewQuestionSave}
              className="bg-lider-red hover:bg-red-700"
            >
              Create Question
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
              This will permanently delete this question and all associated answers.
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

export default TestsQuestionsTab;
