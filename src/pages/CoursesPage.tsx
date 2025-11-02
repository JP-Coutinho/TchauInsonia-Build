import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Course } from '../types';

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAllCourses();
      setCourses(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao carregar cursos. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = (courseId: string) => {
    navigate(`/course/${courseId}/create-lesson`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flexCenter">
        <div className="textCenter">
          <div className="loading-spinner-large"></div>
          <p className="font16 greyColor" style={{marginTop: '20px'}}>Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lightBg">
      {/* Header */}
      <header className="header-custom">
        <div className="container-custom">
          <div className="flexBetween" style={{padding: '30px 0'}}>
            <div>
              <h1 className="font48 extraBold gradientText">
                Gerenciamento de Cursos
              </h1>
              <p className="font18 greyColor flexCenter" style={{marginTop: '10px', justifyContent: 'flex-start'}}>
                <svg className="greenColor" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bem-vindo, {user?.username}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger font16 semiBold"
              style={{padding: '12px 24px'}}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom gradientSecondary min-h-screen" style={{padding: '30px 0'}}>
          {/* Action Buttons */}
          <div className="textCenter" style={{marginBottom: '40px'}}>
            <button
              onClick={() => navigate('/create-form')}
              className="btn-warning font18 semiBold flexCenter"
              style={{padding: '15px 30px'}}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '10px'}}>
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Criar Formulário
            </button>
          </div>
          {error && (
            <div className="notification-error" style={{marginBottom: '30px'}}>
              <p>{error}</p>
              <button
                onClick={loadCourses}
                className="font14 semiBold" 
                style={{marginTop: '10px', textDecoration: 'underline', background: 'none', border: 'none'}}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {courses.length === 0 && !error ? (
            <div className="textCenter" style={{padding: '60px 0'}}>
              <h3 className="font24 semiBold darkColor" style={{marginBottom: '10px'}}>
                Nenhum curso encontrado
              </h3>
              <p className="font16 greyColor">
                Não há cursos disponíveis no momento.
              </p>
            </div>
          ) : (
            <div className="grid-layout">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="card-custom card-hover"
                >
                  <div style={{padding: '30px'}}>
                    <div style={{marginBottom: '20px'}}>
                      <div className="purpleBg radius8 flexCenter" style={{width: '50px', height: '50px', marginBottom: '20px'}}>
                        <svg className="whiteColor" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                          <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font24 bold darkColor" style={{marginBottom: '15px'}}>
                      {course.title}
                    </h3>
                    <p className="font16 greyColor" style={{marginBottom: '20px', lineHeight: '1.6'}}>
                      {course.description}
                    </p>
                    <div className="font12 greyColor" style={{marginBottom: '20px'}}>
                      <p className="flexCenter" style={{justifyContent: 'flex-start', marginBottom: '5px'}}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Criado em: {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      {course.updatedAt !== course.createdAt && (
                        <p className="flexCenter" style={{justifyContent: 'flex-start'}}>
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Atualizado em: {new Date(course.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="flexBetween" style={{gap: '15px'}}>
                      <button
                        onClick={() => navigate(`/course/${course.id}/lesson/demo`)}
                        className="btn-success font14 semiBold x50"
                        style={{padding: '12px 20px'}}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Ver Demo
                      </button>
                      <button
                        onClick={() => handleCreateLesson(course.id)}
                        className="btn-primary font14 semiBold x50"
                        style={{padding: '12px 20px'}}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Criar Aula
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
};

export default CoursesPage;