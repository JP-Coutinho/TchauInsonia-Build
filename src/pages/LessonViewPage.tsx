import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  isWelcome: boolean;
  videoUrl?: string;
  audioUrl?: string;
  textContent?: string;
  htmlContent: string;
  durationMinutes: number;
  prerequisites: string[];
}

const LessonViewPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = () => {
      try {
        let lessonData: Lesson;

        if (lessonId === 'preview') {
          // Load from localStorage for preview
          const previewData = localStorage.getItem('lessonPreview');
          if (previewData) {
            lessonData = JSON.parse(previewData);
          } else {
            throw new Error('Dados de preview não encontrados');
          }
        } else {
          // Mock data for regular lessons
          lessonData = {
            id: lessonId || '1',
            title: 'Fundamentos do Sono Humano',
            description: 'Uma introdução completa aos conceitos básicos do sono e sua importância para a saúde.',
            order: 1,
            isWelcome: true,
            videoUrl: 'https://example.com/video.mp4',
            htmlContent: `
              <h2>Bem-vindo ao Curso de Medicina do Sono</h2>
              <p>Nesta primeira aula, você aprenderá sobre:</p>
              <ul>
                <li>O que é o sono e por que é importante</li>
                <li>Os diferentes estágios do sono</li>
                <li>Como o sono afeta nossa saúde</li>
                <li>Distúrbios comuns do sono</li>
              </ul>
              <h3>Objetivos de Aprendizagem</h3>
              <p>Ao final desta aula, você será capaz de:</p>
              <ol>
                <li>Definir o que é o sono</li>
                <li>Identificar os principais estágios do sono</li>
                <li>Explicar a importância do sono para a saúde</li>
              </ol>
            `,
            durationMinutes: 45,
            prerequisites: []
          };
        }

        setLesson(lessonData);
      } catch (error) {
        console.error('Erro ao carregar aula:', error);
        navigate(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [courseId, lessonId, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aula não encontrada</h2>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tchauinsonia Platform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">Olá, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-3xl p-4 sm:p-8 border border-gray-100">
          {/* Lesson Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-gray-600 mt-1">{lesson.description}</p>
              </div>
            </div>
            
            {lesson.isWelcome && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Aula de Boas-vindas
              </span>
            )}
          </div>

          {/* Prerequisites */}
          {lesson.prerequisites.length > 0 && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pré-requisitos
              </h3>
              <p className="text-yellow-700">Esta aula requer o conhecimento das seguintes aulas:</p>
              <ul className="mt-2 space-y-1">
                {lesson.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="text-yellow-700 flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {prerequisite}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Media Content */}
          {(lesson.videoUrl || lesson.audioUrl) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                Mídia
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {lesson.videoUrl && (
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Vídeo da Aula</h4>
                    <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <p className="text-sm">Clique para reproduzir</p>
                        <p className="text-xs text-gray-400 mt-1">{lesson.durationMinutes} minutos</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {lesson.audioUrl && (
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Áudio da Aula</h4>
                    <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                        <p className="text-sm">Player de Áudio</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              Conteúdo
            </h3>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div 
                className="prose prose-sm sm:prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: lesson.htmlContent }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (lessonId === 'preview') {
                  navigate(`/course/${courseId}/create-lesson`);
                } else {
                  navigate(`/courses/${courseId}`);
                }
              }}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl shadow-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-medium flex items-center text-sm sm:text-base"
            >
              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {lessonId === 'preview' ? 'Voltar ao Editor' : 'Voltar aos Cursos'}
            </button>

            <div className="text-sm text-gray-500">
              {lessonId === 'preview' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium mr-4">
                  PREVIEW
                </span>
              )}
              Aula {lesson.order} • {lesson.durationMinutes} min
            </div>

            {lessonId === 'preview' ? (
              <button
                onClick={() => navigate(`/course/${courseId}/create-lesson`)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar Aula
              </button>
            ) : (
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled
              >
                Próxima Aula
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonViewPage;