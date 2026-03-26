import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/common/DashboardLayout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardLayout title="Dashboard">
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'faculty' && <FacultyDashboard />}
      {user.role === 'student' && <StudentDashboard />}
    </DashboardLayout>
  );
};

export default DashboardPage;
