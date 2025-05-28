import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrafficRulesSection from '@/components/materials/TrafficRulesSection';

// Mock sections data
const mockSections = [
  {
    id: 1,
    title: 'Introduction to Driving',
    description: 'Basic concepts and preparation for driving',
    materials: [
      { id: 101, title: 'Getting Started with Driving', status: 'published', premium: false },
      { id: 102, title: 'Understanding Your Vehicle', status: 'published', premium: false },
      { id: 103, title: 'Pre-Driving Checks', status: 'published', premium: false },
    ],
  },
  {
    id: 2,
    title: 'Road Signs and Markings',
    description: 'Learn all traffic signs and road markings',
    materials: [
      { id: 201, title: 'Warning Signs', status: 'published', premium: false },
      { id: 202, title: 'Regulatory Signs', status: 'published', premium: false },
      { id: 203, title: 'Informational Signs', status: 'draft', premium: false },
      { id: 204, title: 'Road Markings and Lane Discipline', status: 'published', premium: false },
    ],
  },
  {
    id: 3,
    title: 'Traffic Rules',
    description: 'Understanding and following traffic regulations',
    materials: [
      { id: 301, title: 'Right of Way Rules', status: 'published', premium: false },
      { id: 302, title: 'Speed Limits and Control', status: 'published', premium: false },
      { id: 303, title: 'Intersection Navigation', status: 'draft', premium: false },
      { id: 304, title: 'Highway Driving Rules', status: 'published', premium: true },
    ],
  },
  {
    id: 4,
    title: 'Vehicle Controls',
    description: 'Mastering vehicle operation and controls',
    materials: [
      { id: 401, title: 'Basic Vehicle Controls', status: 'published', premium: true },
      { id: 402, title: 'Manual Transmission Techniques', status: 'published', premium: true },
      { id: 403, title: 'Advanced Steering Techniques', status: 'draft', premium: true },
    ],
  },
  {
    id: 5,
    title: 'Defensive Driving',
    description: 'Techniques to anticipate and avoid accidents',
    materials: [
      { id: 501, title: 'Hazard Awareness', status: 'published', premium: true },
      { id: 502, title: 'Space Management', status: 'draft', premium: true },
      { id: 503, title: 'Emergency Maneuvers', status: 'draft', premium: true },
      { id: 504, title: 'Weather Condition Driving', status: 'published', premium: true },
    ],
  }
];

const Materials = () => {
  const authState  = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('traffic-rules'); // 'traffic-rules' or 'materials'
  

  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || (authState.user.role !== 'teacher' && authState.user.role !== 'admin' && authState.user.role !== 'student'))) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.user, navigate]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };
  
  // Filter materials based on search term and status
  const filteredSections = mockSections.map(section => {
    const filteredMaterials = section.materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    return {
      ...section,
      materials: filteredMaterials,
      hasFilteredItems: filteredMaterials.length > 0
    };
  }).filter(section => section.hasFilteredItems);

  if (authState.isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-xl">Завантаження...</h2>
        </div>
      </PageLayout>
    );
  }

  // Status badge renderer
  const StatusBadge = ({ status }: { status: string }) => {
    switch(status) {
      case 'published':
        return <Badge className="bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-600">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isAdmin = authState.user?.role === 'admin';
  const isInstructor = authState.user?.role === 'instructor';

  // Додаємо перевірку для студентів без підписки
  if (authState.user?.role === 'student' && authState.user.is_paid === false) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <Card className="bg-secondary border-gray-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle size={48} className="text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Потрібна підписка</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Щоб отримати доступ до навчальних матеріалів, потрібна активна підписка.
                Оформіть підписку, щоб переглядати всі навчальні матеріали.
              </p>
              <Button 
                className="bg-lider-red hover:bg-red-700"
                onClick={() => navigate('/payments')}
              >
                Оформити підписку
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-2">
              Навчальні матеріали
            </h1>
            <p className="text-gray-400">
              {isAdmin ? "Створюйте та керуйте навчальними матеріалами для студентів" :
               isInstructor ? "Переглядайте та коментуйте навчальні матеріали для студентів" :
               "Вивчайте навчальні матеріали для підготовки до іспиту"}
            </p>
          </CardContent>
        </Card>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="traffic-rules" activeClassName="bg-lider-red">
              Правила дорожнього руху
            </TabsTrigger>
            <TabsTrigger value="materials" activeClassName="bg-lider-red">
              Додаткові матеріали
            </TabsTrigger>
          </TabsList>
          
          {/* Traffic Rules Section */}
          <TabsContent value="traffic-rules">
            <TrafficRulesSection/>
          </TabsContent>
          
          {/* Custom Section */}
          <TabsContent value="materials">
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Пошук матеріалів..."
                  className="pl-10 bg-secondary border-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                
                {isAdmin && (
                  <Button className="bg-lider-red hover:bg-red-700">
                    <Plus size={16} className="mr-2" />
                    Створити матеріал
                  </Button>
                )}
              </div>
            </div>
            
            {/* Materials Sections */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map(section => (
                  <Card key={section.id} className="bg-secondary border-gray-800">
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center text-xl">
                            <BookOpen size={20} className="mr-2 text-lider-red" />
                            {section.title}
                          </CardTitle>
                          <CardDescription className="mt-1">{section.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Materials</div>
                            <div className="font-semibold">{section.materials.length}</div>
                          </div>
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedSections.includes(section.id) && (
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead>Назва</TableHead>
                              <TableHead>Статус</TableHead>
                              <TableHead>Тип</TableHead>
                              <TableHead className="text-right">Дії</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.materials.map(material => (
                              <TableRow key={material.id} className="border-gray-700">
                                <TableCell className="font-medium">{material.title}</TableCell>
                                <TableCell>
                                  <StatusBadge status={material.status} />
                                </TableCell>
                                <TableCell>
                                  {material.premium ? (
                                    <Badge className="bg-yellow-600">Premium</Badge>
                                  ) : (
                                    <Badge className="bg-blue-600">Free</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    <Eye size={16} />
                                  </Button>
                                  
                                  {isAdmin && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-green-400 hover:text-green-300"
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {isAdmin && (
                          <div className="mt-4 flex justify-end">
                            <Button className="bg-lider-red hover:bg-red-700">
                              <Plus size={16} className="mr-2" />
                              Додати до {section.title}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="bg-secondary border-gray-800 text-center p-8">
                  <CardContent>
                    <p className="text-gray-400">Матеріалів, що відповідають критеріям пошуку, не знайдено.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Materials;
