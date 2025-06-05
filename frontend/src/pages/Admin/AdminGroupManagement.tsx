
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for groups
const mockGroups = [
  {
    id: '1',
    name: 'Morning B1 Group',
    schedule: 'Mon, Wed, Fri - 09:00-11:00',
    location: 'Main Branch',
    instructor: 'Alex Instructor',
    instructorId: '3',
    totalStudents: 8,
    category: 'Category B'
  },
  {
    id: '2',
    name: 'Evening B2 Group',
    schedule: 'Tue, Thu - 18:00-20:00',
    location: 'Downtown Branch',
    instructor: 'Maria Rodriguez',
    instructorId: '5',
    totalStudents: 6,
    category: 'Category B'
  },
  {
    id: '3',
    name: 'Weekend A1 Group',
    schedule: 'Sat, Sun - 10:00-14:00',
    location: 'East Branch',
    instructor: 'Robert Chen',
    instructorId: '6',
    totalStudents: 5,
    category: 'Category A'
  },
  {
    id: '4',
    name: 'Intensive C1 Group',
    schedule: 'Mon to Fri - 14:00-17:00',
    location: 'Main Branch',
    instructor: 'David Wilson',
    instructorId: '7',
    totalStudents: 4,
    category: 'Category C'
  },
];

// Mock data for instructors (simplified for dropdown)
const mockInstructors = [
  { id: '3', name: 'Alex Instructor' },
  { id: '5', name: 'Maria Rodriguez' },
  { id: '6', name: 'Robert Chen' },
  { id: '7', name: 'David Wilson' },
];

// Mock data for branches (simplified for dropdown)
const mockBranches = [
  { id: '1', name: 'Main Branch' },
  { id: '2', name: 'Downtown Branch' },
  { id: '3', name: 'East Branch' },
];

const AdminGroupManagement = () => {
  const  authState  = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  
  // Redirect to login if not authenticated or not an admin
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  // Filter groups based on search term
  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    setIsEditGroupDialogOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    // In a real app, this would call an API to delete the group
    console.log(`Delete group with ID: ${groupId}`);
    // Then refresh the groups list
  };

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!authState.user || authState.user.role !== 'admin') {
    return null; // Will redirect to login
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Group Management
            </h1>
            <p className="text-gray-400">
              Create, edit, and manage student groups and their schedules
            </p>
          </CardContent>
        </Card>

        {/* Search and Add Group */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search groups..."
              className="pl-10 bg-secondary border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lider-red hover:bg-red-700 w-full sm:w-auto">
                <Plus size={18} className="mr-2" /> Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border-gray-700">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Add a new student group and assign an instructor.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="group-name" className="text-right">Group Name</label>
                  <Input id="group-name" placeholder="Group name" className="col-span-3 bg-gray-800 border-gray-700" />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right">Category</label>
                  <select id="category" className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2">
                    <option value="">Select category</option>
                    <option value="Category A">Category A</option>
                    <option value="Category B">Category B</option>
                    <option value="Category C">Category C</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="instructor" className="text-right">Instructor</label>
                  <select id="instructor" className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2">
                    <option value="">Select instructor</option>
                    {mockInstructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="location" className="text-right">Location</label>
                  <select id="location" className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2">
                    <option value="">Select branch</option>
                    {mockBranches.map(branch => (
                      <option key={branch.id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="schedule" className="text-right">Schedule</label>
                  <Input id="schedule" placeholder="e.g., Mon, Wed, Fri - 09:00-11:00" className="col-span-3 bg-gray-800 border-gray-700" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddGroupDialogOpen(false)}>Cancel</Button>
                <Button className="bg-lider-red hover:bg-red-700">Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups Table */}
        <Card className="bg-secondary border-gray-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-secondary">
                  <TableHead>Group Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map(group => (
                  <TableRow key={group.id} className="border-gray-700">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-lider-red" />
                        {group.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400">
                        {group.category}
                      </span>
                    </TableCell>
                    <TableCell>{group.instructor}</TableCell>
                    <TableCell>{group.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {group.schedule}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{group.totalStudents}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-500 hover:text-blue-400 p-1 h-auto"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-400 p-1 h-auto"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {filteredGroups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No groups match your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent className="bg-secondary border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update group information and settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedGroup && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-group-name" className="text-right">Group Name</label>
                <Input 
                  id="edit-group-name" 
                  defaultValue={selectedGroup.name} 
                  className="col-span-3 bg-gray-800 border-gray-700" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-category" className="text-right">Category</label>
                <select 
                  id="edit-category" 
                  defaultValue={selectedGroup.category}
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2"
                >
                  <option value="Category A">Category A</option>
                  <option value="Category B">Category B</option>
                  <option value="Category C">Category C</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-instructor" className="text-right">Instructor</label>
                <select 
                  id="edit-instructor" 
                  defaultValue={selectedGroup.instructorId}
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2"
                >
                  {mockInstructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-location" className="text-right">Location</label>
                <select 
                  id="edit-location" 
                  defaultValue={selectedGroup.location}
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2"
                >
                  {mockBranches.map(branch => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-schedule" className="text-right">Schedule</label>
                <Input 
                  id="edit-schedule" 
                  defaultValue={selectedGroup.schedule} 
                  className="col-span-3 bg-gray-800 border-gray-700" 
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGroupDialogOpen(false)}>Cancel</Button>
            <Button className="bg-lider-red hover:bg-red-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default AdminGroupManagement;
