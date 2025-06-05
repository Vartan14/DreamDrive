import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle} from 'lucide-react';

import TrafficRulesSection from '@/components/materials/TrafficRulesSection';
import PageHeader from '@/components/ui/PageHeader';



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
        <PageHeader 
          title="Навчальні матеріали" 
          subtitle="Вивчайте офіційні правила дорожнього руху"
        />
        {/* <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
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
        </Card> */}
            <TrafficRulesSection/>
        
        {/* <Tabs 
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
          
          <TabsContent value="traffic-rules">
          </TabsContent>
          
          <TabsContent value="materials">
            <div></div>
          </TabsContent>
        </Tabs> */}
      </div>
    </PageLayout>
  );
};

export default Materials;
