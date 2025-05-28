import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import InstructorDashboard from '@/components/dashboard/InstructorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
      <PageLayout>
        <div className="container-custom py-12">
          {/* Header with greeting */}
          <Card className="bg-gradient-to-r from-secondary to-black border-gray-800 mb-8">
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold mb-2">
                Вітаємо, {user?.first_name}
              </h1>
              <p className="text-gray-400">
                {user?.role === 'student' && "Ласкаво просимо до вашої учнівської панелі керування"}
                {user?.role === 'teacher' && "Ласкаво просимо до вашої інструкторської панелі керування"}
                {user?.role === 'admin' && "Ласкаво просимо до вашої адміністративної панелі керування"}
              </p>
            </CardContent>
          </Card>

          {/* Role-specific dashboard content */}
          {user?.role === 'student' && <StudentDashboard user={user} />}
          {user?.role === 'teacher' && <InstructorDashboard user={user} />}
          {/* {user?.role === 'admin' && <AdminDashboard user={user} />} */}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
