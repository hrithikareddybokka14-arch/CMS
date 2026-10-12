import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { FacultyView } from './views/FacultyView';
import { CoursesView } from './views/CoursesView';
import { AttendanceView } from './views/AttendanceView';
import { MarksView } from './views/MarksView';
import { StudentDetailView } from './views/StudentDetailView';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Route wrapper for StudentDetailView with URL parameter support
const StudentDetailRouteWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = React.useState(location.state?.student || null);
  const [loading, setLoading] = React.useState(!location.state?.student);

  React.useEffect(() => {
    if (!student || !student.name) {
      setLoading(true);
      const fetchStudent = async () => {
        try {
          // Check whether id is a studentId code (e.g. STU-...) or MongoDB ObjectId
          let data;
          if (id && id.startsWith('STU-')) {
            data = await api.students.getByStudentId(id);
          } else {
            data = await api.students.getById(id);
          }
          setStudent(data);
        } catch (err) {
          console.error(err);
          // Fallback to minimal placeholder
          setStudent({ studentId: id, name: id });
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  if (loading && !student) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        <p>Loading student information...</p>
      </div>
    );
  }

  return (
    <StudentDetailView
      student={student}
      onBack={() => navigate('/students')}
      onEdit={() => navigate('/students')}
    />
  );
};

// Main Layout component enclosing the sidebar, navbar, and route views
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive current tab key from route pathname
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.startsWith('/students') || path.startsWith('/student/')) return 'students';
    if (path.startsWith('/faculty')) return 'faculty';
    if (path.startsWith('/courses')) return 'courses';
    if (path.startsWith('/attendance')) return 'attendance';
    if (path.startsWith('/marks')) return 'marks';
    return 'dashboard';
  };

  const activeTab = getCurrentTab();

  const handleTabChange = (tab) => {
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'students':
        navigate('/students');
        break;
      case 'faculty':
        navigate('/faculty');
        break;
      case 'courses':
        navigate('/courses');
        break;
      case 'attendance':
        navigate('/attendance');
        break;
      case 'marks':
        navigate('/marks');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          activeTab={location.pathname.startsWith('/student/') ? 'student-detail' : activeTab} 
        />

        <main className="page-container">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <DashboardView 
                  onNavigate={handleTabChange} 
                  onViewStudent={(student) => navigate(`/student/${student.studentId}`, { state: { student } })} 
                />
              } 
            />
            <Route 
              path="/students" 
              element={
                <StudentsView 
                  onViewDetails={(student) => navigate(`/student/${student.studentId}`, { state: { student } })} 
                />
              } 
            />
            <Route path="/student/:id" element={<StudentDetailRouteWrapper />} />
            <Route path="/faculty" element={<FacultyView />} />
            <Route path="/courses" element={<CoursesView />} />
            <Route path="/attendance" element={<AttendanceView />} />
            <Route path="/marks" element={<MarksView />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
