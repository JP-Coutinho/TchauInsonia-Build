
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CreateLessonPage from './pages/CreateLessonPage';
import CreateFormPage from './pages/CreateFormPage';
import LessonViewPage from './pages/LessonViewPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/create-lesson"
              element={
                <ProtectedRoute>
                  <CreateLessonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-form"
              element={
                <ProtectedRoute>
                  <CreateFormPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="*" element={<Navigate to="/courses" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
