
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TestsContentTab from '@/components/admin/TestsContentTab';
import TestsTicketsTab from '@/components/admin/TestsTicketsTab';
import TestsQuestionsTab from '@/components/admin/TestsQuestionsTab';
import TestsCustomTab from '@/components/admin/TestsCustomTab';

const AdminTestManagement = () => {
  const  authState  = useAuthStore();  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tests');
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!authState.isLoading && (!authState.user || authState.user.role !== 'admin')) {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive"
      });
    }
  }, [authState.isLoading, authState.user, navigate, toast]);
  
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
        title="Test Management" 
        subtitle="View and manage all tests in the system"
      />
      
      <div className="container-custom py-8">
        <Tabs defaultValue="tests" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger 
              value="tests" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              Tests
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              Tickets
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="data-[state=active]:bg-lider-red data-[state=active]:text-white"
            >
              Custom Tests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tests" className="space-y-6">
            <TestsContentTab />
          </TabsContent>
          
          <TabsContent value="tickets" className="space-y-6">
            <TestsTicketsTab />
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-6">
            <TestsQuestionsTab />
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <TestsCustomTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminTestManagement;
