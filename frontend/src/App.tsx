import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import StudentsPage from "@/pages/StudentsPage";
import FacultyPage from "@/pages/FacultyPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import SubjectsPage from "@/pages/SubjectsPage";
import TimetablePage from "@/pages/TimetablePage";
import AttendancePage from "@/pages/AttendancePage";
import NoticesPage from "@/pages/NoticesPage";
import FacilitiesPage from "@/pages/FacilitiesPage";
import BookingsPage from "@/pages/BookingsPage";
import NotFound from "@/pages/NotFound";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute roles={['admin', 'faculty']}><StudentsPage /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute roles={['admin']}><FacultyPage /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute roles={['admin']}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute roles={['admin']}><SubjectsPage /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
        <Route path="/facilities" element={<ProtectedRoute roles={['admin']}><FacilitiesPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
