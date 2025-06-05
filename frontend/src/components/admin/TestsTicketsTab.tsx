
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
  DialogTrigger,
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
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for tickets
const mockTickets = [
  {
    id: "1",
    ticket_number: "001",
    questions: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120"]
  },
  {
    id: "2",
    ticket_number: "002",
    questions: ["121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140"]
  },
  {
    id: "3",
    ticket_number: "003",
    questions: ["141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160"]
  }
];

const TestsTicketsTab = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ ticket_number: "", questions: [] });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket => 
    ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handlers
  const handleTicketView = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };
  
  const handleTicketEdit = (ticket: any) => {
    setSelectedTicket({ ...ticket });
    setIsEditDialogOpen(true);
  };
  
  const handleTicketDelete = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddTicket = () => {
    setNewTicket({ ticket_number: "", questions: [] });
    setIsAddDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedTicket) {
      setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
      toast({
        title: "Ticket Deleted",
        description: `Ticket #${selectedTicket.ticket_number} has been deleted.`
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleTicketSave = () => {
    if (selectedTicket) {
      setTickets(prev => prev.map(t => 
        t.id === selectedTicket.id ? { ...selectedTicket } : t
      ));
      toast({
        title: "Ticket Updated",
        description: `Ticket #${selectedTicket.ticket_number} has been updated.`
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleNewTicketSave = () => {
    if (newTicket.ticket_number) {
      const newId = (parseInt(tickets[tickets.length - 1]?.id || "0") + 1).toString();
      setTickets(prev => [...prev, { id: newId, ...newTicket }]);
      toast({
        title: "Ticket Created",
        description: `Ticket #${newTicket.ticket_number} has been created.`
      });
      setIsAddDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Ticket number is required",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-secondary border-gray-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Test Tickets</CardTitle>
            <CardDescription>
              Manage test tickets containing 20 questions each
            </CardDescription>
          </div>
          <Button 
            onClick={handleAddTicket}
            className="bg-lider-red hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Ticket
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
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
                <TableHead className="text-gray-300">Ticket Number</TableHead>
                <TableHead className="text-gray-300">Questions Count</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium">
                      Ticket #{ticket.ticket_number}
                    </TableCell>
                    <TableCell>
                      {ticket.questions.length} questions
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTicketView(ticket)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTicketEdit(ticket)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleTicketDelete(ticket)}
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
      
      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicket?.ticket_number}</DialogTitle>
            <DialogDescription>
              View ticket details and included questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Ticket ID</h3>
              <p>{selectedTicket?.id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400">Questions</h3>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {selectedTicket?.questions.map((qId: string) => (
                  <div key={qId} className="bg-gray-800 p-2 rounded text-center">
                    {qId}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Update ticket details and questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="ticketNumber" className="block text-sm font-medium mb-1">
                Ticket Number
              </label>
              <Input
                id="ticketNumber"
                value={selectedTicket?.ticket_number || ""}
                onChange={(e) => setSelectedTicket({...selectedTicket, ticket_number: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="questions" className="block text-sm font-medium mb-1">
                Questions (comma-separated IDs)
              </label>
              <Input
                id="questions"
                value={selectedTicket?.questions?.join(", ") || ""}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim());
                  setSelectedTicket({...selectedTicket, questions: values});
                }}
                className="bg-gray-800 border-gray-700"
              />
              {selectedTicket?.questions?.length !== 20 && (
                <p className="text-red-400 text-sm mt-1">
                  Ticket must contain exactly 20 questions (currently: {selectedTicket?.questions?.length})
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTicketSave}
              className="bg-lider-red hover:bg-red-700"
              disabled={selectedTicket?.questions?.length !== 20}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add New Ticket Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Ticket</DialogTitle>
            <DialogDescription>
              Create a new test ticket with 20 questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="newTicketNumber" className="block text-sm font-medium mb-1">
                Ticket Number
              </label>
              <Input
                id="newTicketNumber"
                value={newTicket.ticket_number}
                onChange={(e) => setNewTicket({...newTicket, ticket_number: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="newQuestions" className="block text-sm font-medium mb-1">
                Questions (comma-separated IDs)
              </label>
              <Input
                id="newQuestions"
                value={newTicket.questions.join(", ")}
                onChange={(e) => {
                  const values = e.target.value.split(",").map(v => v.trim());
                  setNewTicket({...newTicket, questions: values});
                }}
                className="bg-gray-800 border-gray-700"
              />
              {newTicket.questions.length !== 20 && (
                <p className="text-red-400 text-sm mt-1">
                  Ticket must contain exactly 20 questions (currently: {newTicket.questions.length})
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewTicketSave}
              className="bg-lider-red hover:bg-red-700"
              disabled={!newTicket.ticket_number || newTicket.questions.length !== 20}
            >
              Create Ticket
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
              This will permanently delete Ticket #{selectedTicket?.ticket_number}.
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

export default TestsTicketsTab;
