import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Phone, MapPin, Clock, Plus, Edit, Trash2, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Дані філій для відображення
const branches = [
  {
    id: '1',
    name: 'Київ, м Позняки ',
    address: 'вул. Тараса Шевченка, 123, Київ, Україна',
    phone: '+380 44 123 4567',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=123+Main+Street+Kyiv+Ukraine',
  },
  {
    id: '2',
    name: 'Львів, проспект Західний',
    address: 'просп. Західний, 456, Львів, Україна',
    phone: '+380 32 234 5678',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=456+West+Avenue+Lviv+Ukraine',
  },
  {
    id: '3',
    name: 'Одеса, бульвар Південний',
    address: 'бульв. Південний, 789, Одеса, Україна',
    phone: '+380 48 345 6789',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=789+South+Boulevard+Odesa+Ukraine',
  },
  {
    id: '4',
    name: 'Харків, вул. Київська',
    address: 'вул. Київська, 101/34а, Харків, Україна',
    phone: '+380 57 456 7890',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=101+East+Road+Kharkiv+Ukraine',
  },
  {
    id: '5',
    name: 'Чернігів, вул. Північна',
    address: 'вул. Північна, 202, Чернігів, Україна',
    phone: '+380 46 567 8901',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=202+North+Street+Chernihiv+Ukraine',
  },
  {
    id: '6',
    name: 'Київ, м. Шулявка',
    address: 'просп. Центральний, 303, Київ, Україна',
    phone: '+380 56 678 9012',
    workingHours: 'Понеділок–П’ятниця: 9:00 – 18:00, Субота: 10:00 – 15:00',
    mapUrl: 'https://maps.google.com/?q=303+Central+Avenue+Dnipro+Ukraine',
  },
];

const AdminBranchManagement = () => {
  const  authState  = useAuthStore();
  const navigate = useNavigate();
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  
  // Перенаправлення, якщо не адміністратор
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch);
    setIsEditBranchDialogOpen(true);
  };

  const handleDeleteBranch = (branchId: string) => {
    // У реальному додатку тут буде API-запит на видалення філії
    console.log(`Видалити філію з ID: ${branchId}`);
  };

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!authState.user || authState.user.role !== 'admin') {
    return null; // Перенаправлення на вхід
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Керування філіями
            </h1>
            <p className="text-gray-400">
              Керуйте філіями автошколи та їх інформацією
            </p>
          </CardContent>
        </Card>

        {/* Кнопка додати філію */}
        <div className="mb-6 flex justify-end">
          <Dialog open={isAddBranchDialogOpen} onOpenChange={setIsAddBranchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lider-red hover:bg-red-700">
                <Plus size={18} className="mr-2" /> Додати філію
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border-gray-700">
              <DialogHeader>
                <DialogTitle>Додати нову філію</DialogTitle>
                <DialogDescription>
                  Створіть нову філію для автошколи.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-name" className="text-right">Назва філії</label>
                  <input 
                    id="branch-name" 
                    placeholder="Назва філії" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-address" className="text-right">Адреса</label>
                  <input 
                    id="branch-address" 
                    placeholder="Повна адреса" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-phone" className="text-right">Телефон</label>
                  <input 
                    id="branch-phone" 
                    placeholder="Номер телефону" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-email" className="text-right">Email</label>
                  <input 
                    id="branch-email" 
                    placeholder="Email адреса" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-hours" className="text-right">Графік роботи</label>
                  <input 
                    id="branch-hours" 
                    placeholder="Графік роботи" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-facilities" className="text-right">Зручності</label>
                  <textarea 
                    id="branch-facilities" 
                    placeholder="Введіть зручності через кому" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2 h-20" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="branch-image" className="text-right">URL зображення</label>
                  <input 
                    id="branch-image" 
                    placeholder="Посилання на зображення філії" 
                    className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddBranchDialogOpen(false)}>Скасувати</Button>
                <Button className="bg-lider-red hover:bg-red-700">Додати філію</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Картки філій */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {branches.map(branch => (
            <Card key={branch.id} className="bg-secondary border-gray-800 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto flex items-center justify-center bg-gray-900">
                  <Building size={64} className="text-gray-600" />
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{branch.name}</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-500 hover:text-blue-400 p-1 h-auto"
                        onClick={() => handleEditBranch(branch)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-400 p-1 h-auto"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-gray-300 text-sm mb-4">
                    <div className="flex items-start">
                      <MapPin size={14} className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                      <span>{branch.workingHours}</span>
                    </div>
                   
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Таблиця філій */}
        <Card className="bg-secondary border-gray-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-secondary">
                  <TableHead>Філія</TableHead>
                  <TableHead>Контакти</TableHead>
                  <TableHead>Графік</TableHead>
                  <TableHead>Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map(branch => (
                  <TableRow key={branch.id} className="border-gray-700">
                    <TableCell>
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-xs text-gray-400">{branch.address}</div>
                    </TableCell>
                    <TableCell>
                      <div>{branch.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{branch.workingHours}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-500 hover:text-blue-400 p-1 h-auto"
                          onClick={() => handleEditBranch(branch)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-400 p-1 h-auto"
                          onClick={() => handleDeleteBranch(branch.id)}
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
      </div>
      
      {/* Діалог редагування філії */}
      <Dialog open={isEditBranchDialogOpen} onOpenChange={setIsEditBranchDialogOpen}>
        <DialogContent className="bg-secondary border-gray-700">
          <DialogHeader>
            <DialogTitle>Редагувати філію</DialogTitle>
            <DialogDescription>
              Оновіть інформацію та налаштування філії.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBranch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-name" className="text-right">Назва філії</label>
                <input 
                  id="edit-branch-name" 
                  defaultValue={selectedBranch.name} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-address" className="text-right">Адреса</label>
                <input 
                  id="edit-branch-address" 
                  defaultValue={selectedBranch.address} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-phone" className="text-right">Телефон</label>
                <input 
                  id="edit-branch-phone" 
                  defaultValue={selectedBranch.phone} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-email" className="text-right">Email</label>
                <input 
                  id="edit-branch-email" 
                  defaultValue={selectedBranch.email} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-hours" className="text-right">Графік роботи</label>
                <input 
                  id="edit-branch-hours" 
                  defaultValue={selectedBranch.workingHours} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-facilities" className="text-right">Зручності</label>
                <textarea 
                  id="edit-branch-facilities" 
                  defaultValue={selectedBranch.facilities.join(', ')} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2 h-20" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-branch-image" className="text-right">URL зображення</label>
                <input 
                  id="edit-branch-image" 
                  defaultValue={selectedBranch.image} 
                  className="col-span-3 bg-gray-800 border-gray-700 rounded-md p-2" 
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBranchDialogOpen(false)}>Скасувати</Button>
            <Button className="bg-lider-red hover:bg-red-700">Зберегти зміни</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default AdminBranchManagement;
