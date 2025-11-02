import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { courseApi } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import type { CreateLessonRequest, Course } from '../types';

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
  isWelcome: boolean;
  videoUrl: string;
  audioUrl: string;
  htmlContent: string;
  durationMinutes: number;
  prerequisites: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  difficulty: string;
  estimatedDurationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  associatedCourseId: string;
  isWelcomeCourse: boolean;
  lessons: Lesson[];
}

const schema = yup.object({
  title: yup.string().required('Título é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  order: yup.number().min(0, 'Ordem deve ser maior ou igual a 0').required('Ordem é obrigatória'),
  category: yup.string().required('Categoria é obrigatória'),
  isWelcome: yup.boolean().required(),
  videoUrl: yup.string().url('URL do vídeo deve ser válida').default(''),
  audioUrl: yup.string().url('URL do áudio deve ser válida').default(''),
  htmlContent: yup.string().required('Conteúdo é obrigatório'),
  durationMinutes: yup.number().min(0, 'Duração deve ser maior ou igual a 0').required('Duração é obrigatória'),
  prerequisites: yup.array().of(yup.string().required()).default([]),
});

const CreateLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPrerequisiteDropdownOpen, setIsPrerequisiteDropdownOpen] = useState(false);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateLessonRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      order: 0,
      category: '',
      isWelcome: false,
      videoUrl: '',
      audioUrl: '',
      htmlContent: '',
      durationMinutes: 0,
      prerequisites: [],
    },
  });

  const prerequisites = watch('prerequisites') || [];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (courseId) {
          setLoadingLessons(true);
          
          // Fetch course details with lessons from API
          const response = await courseApi.getCourseById(courseId);
          const courseData = response.data;
          
          setCourseDetails(courseData);
          setCourse({
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          });
          
          // Set available lessons for prerequisites
          setAvailableLessons(courseData.lessons || []);
        }
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Erro ao carregar dados do curso. Tente novamente.');
        // Fallback to mock data in case of API error
        if (courseId) {
          setCourse({
            id: courseId,
            title: `Curso ${courseId}`,
            description: 'Descrição do curso',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setAvailableLessons([]);
        }
      } finally {
        setLoadingLessons(false);
      }
    };

    loadData();
  }, [courseId]);

  const togglePrerequisite = (lessonId: string) => {
    const currentPrerequisites = prerequisites || [];
    if (currentPrerequisites.includes(lessonId)) {
      setValue('prerequisites', currentPrerequisites.filter(p => p !== lessonId));
    } else {
      setValue('prerequisites', [...currentPrerequisites, lessonId]);
    }
  };

  const removePrerequisite = (prerequisiteId: string) => {
    const newPrerequisites = prerequisites.filter(p => p !== prerequisiteId);
    setValue('prerequisites', newPrerequisites);
  };

  const onSubmit = async (data: CreateLessonRequest) => {
    if (!courseId) return;

    setLoading(true);
    setError('');

    try {
      const response = await courseApi.createLesson(courseId, data);
      // Assumindo que a API retorna o ID da aula criada
      const lessonId = response.data?.id || 'new-lesson';
      navigate(`/course/${courseId}/lesson/${lessonId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao criar aula. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen lightBg">
      {/* Header */}
      <header className="header-custom">
        <div className="container-custom">
          <div className="flexBetween" style={{padding: '30px 0'}}>
            <div>
              <h1 className="font48 extraBold gradientText">
                Criar Nova Aula
              </h1>
              {course && (
                <p className="font18 greyColor flexCenter" style={{marginTop: '10px', justifyContent: 'flex-start'}}>
                  <svg className="purpleColor" width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  </svg>
                  Curso: {course.title}
                </p>
              )}
            </div>
            <button
              onClick={handleBack}
              className="btn-secondary font16 semiBold flexCenter"
              style={{padding: '15px 25px'}}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{maxWidth: '80%', margin: '0 auto', padding: '40px 20px'}} className="gradientSecondary min-h-screen">
        {error && (
          <div className="notification-error" style={{marginBottom: '30px'}}>
            {error}
          </div>
        )}

        {/* Course Info */}
        {courseDetails && (
          <div className="card-custom" style={{marginBottom: '30px'}}>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{courseDetails.title}</h2>
                <p className="text-sm text-gray-600">{courseDetails.description}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>{courseDetails.difficulty}</span>
                  <span>•</span>
                  <span>{courseDetails.lessons.length} aulas</span>
                  <span>•</span>
                  <span>{courseDetails.estimatedDurationMinutes} min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          <div className="card-custom">
            <h2 className="font24 bold darkColor flexCenter" style={{justifyContent: 'flex-start', marginBottom: '30px'}}>
              <div className="purpleBg radius8 flexCenter" style={{width: '30px', height: '30px', marginRight: '15px'}}>
                <svg className="whiteColor" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Digite o título da aula"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem *
                </label>
                <input
                  {...register('order', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="0"
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <input
                  {...register('category')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Digite a categoria da aula (ex: Teoria, Prática, Exercício)"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (minutos) *
                </label>
                <input
                  {...register('durationMinutes', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="45"
                />
                {errors.durationMinutes && (
                  <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                placeholder="Digite a descrição da aula"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center">
                <input
                  {...register('isWelcome')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm font-medium text-blue-900">
                  Esta é uma aula de boas-vindas
                </label>
              </div>
              <p className="mt-2 text-xs text-blue-700">
                Aulas de boas-vindas são exibidas primeiro no curso e servem como introdução.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              Mídia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Vídeo
                </label>
                <input
                  {...register('videoUrl')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="https://exemplo.com/video.mp4"
                />
                {errors.videoUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Áudio
                </label>
                <input
                  {...register('audioUrl')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="https://exemplo.com/audio.mp3"
                />
                {errors.audioUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.audioUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              Conteúdo *
            </h2>
            
            <Controller
              name="htmlContent"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Digite o conteúdo da aula usando o editor rich text..."
                />
              )}
            />
            {errors.htmlContent && (
              <p className="mt-1 text-sm text-red-600">{errors.htmlContent.message}</p>
            )}
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              Pré-requisitos
            </h2>
            
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione as aulas pré-requisitos deste curso
              </label>
              
              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPrerequisiteDropdownOpen(!isPrerequisiteDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white flex items-center justify-between"
                >
                  <span className={prerequisites.length > 0 ? "text-gray-900" : "text-gray-500"}>
                    {prerequisites.length > 0 
                      ? `${prerequisites.length} aula(s) selecionada(s)` 
                      : 'Selecione as aulas pré-requisitos deste curso'
                    }
                  </span>
                  <svg className={`w-3 h-3 transition-transform text-blue-500 ${
                    isPrerequisiteDropdownOpen ? 'rotate-180' : ''
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Options */}
                {isPrerequisiteDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {loadingLessons ? (
                      <div className="px-4 py-3 text-gray-500 text-sm flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Carregando aulas...
                      </div>
                    ) : availableLessons.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        Nenhuma aula disponível
                      </div>
                    ) : (
                      availableLessons.map((lesson) => {
                        const isSelected = prerequisites.includes(lesson.id);
                        return (
                          <label
                            key={lesson.id}
                            className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePrerequisite(lesson.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                Aula {lesson.order}: {lesson.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {lesson.description}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {lesson.durationMinutes} min
                              </div>
                            </div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
              
              {/* Click outside to close dropdown */}
              {isPrerequisiteDropdownOpen && (
                <div 
                  className="fixed inset-0 z-5" 
                  onClick={() => setIsPrerequisiteDropdownOpen(false)}
                />
              )}
            </div>

            {prerequisites.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pré-requisitos selecionados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {prerequisites.map((prerequisite, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 shadow-sm"
                    >
                      <svg className="w-3 h-3 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                      </svg>\n                      {prerequisite}
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prerequisite)}
                        className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors duration-150"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                const currentData = {
                  title: watch('title') || 'Título da Aula',
                  description: watch('description') || 'Descrição da aula',
                  order: watch('order') || 1,
                  isWelcome: watch('isWelcome') || false,
                  videoUrl: watch('videoUrl') || '',
                  audioUrl: watch('audioUrl') || '',
                  htmlContent: watch('htmlContent') || '<p>Conteúdo da aula...</p>',
                  durationMinutes: watch('durationMinutes') || 0,
                  prerequisites: watch('prerequisites') || []
                };
                localStorage.setItem('lesson-preview', JSON.stringify(currentData));
                navigate(`/course/${courseId}/lesson/preview`);
              }}
              className="px-6 py-3 border border-blue-300 text-blue-700 bg-blue-50 rounded-2xl font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Visualizar Preview
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Criar Aula
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateLessonPage;