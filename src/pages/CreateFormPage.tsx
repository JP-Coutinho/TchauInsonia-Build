import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { formApi, courseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { CreateFormRequest, Course } from '../types';

const CreateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null);
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateFormRequest>({
    defaultValues: {
      title: '',
      description: '',
      questions: [
        {
          questionText: '',
          questionType: 0,
          maxCharacters: 0,
          isRequired: true,
          order: 0,
          options: [],
        },
      ],
      notificationConfig: {
        generateNotification: false,
        triggerCourseId: '',
        triggerLessonId: '',
        deliveryMethod: 0,
        notificationTitle: '',
        notificationMessage: '',
      },
    },
  });

  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');
  const watchedNotificationConfig = watch('notificationConfig');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await courseApi.getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (watchedNotificationConfig.triggerCourseId) {
        setLoadingCourseDetails(true);
        try {
          const response = await courseApi.getCourseById(watchedNotificationConfig.triggerCourseId);
          setSelectedCourseDetails(response.data);
        } catch (error) {
          console.error('Error loading course details:', error);
          setSelectedCourseDetails(null);
        } finally {
          setLoadingCourseDetails(false);
        }
      } else {
        setSelectedCourseDetails(null);
      }
    };

    loadCourseDetails();
  }, [watchedNotificationConfig.triggerCourseId]);

  const addQuestion = () => {
    appendQuestion({
      questionText: '',
      questionType: 0,
      maxCharacters: 0,
      isRequired: true,
      order: questions.length,
      options: [],
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || [];
    setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      {
        text: '',
        comment: '',
        order: currentOptions.length,
      },
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || [];
    const newOptions = currentOptions.filter((_, index) => index !== optionIndex);
    setValue(`questions.${questionIndex}.options`, newOptions);
  };

  const onSubmit = async (data: CreateFormRequest) => {
    setLoading(true);
    setError('');

    try {
      await formApi.createForm(data);
      navigate('/courses');
    } catch (err: any) {
      console.error('Error creating form:', err);
      setError(err.response?.data?.message || 'Erro ao criar formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };



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
              <button
                onClick={() => navigate('/courses')}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-medium flex items-center"
              >
                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Voltar
              </button>
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
      <main style={{maxWidth: '80%', margin: '0 auto', padding: '40px 20px'}}>
        {error && (
          <div className="notification-error" style={{marginBottom: '30px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          {/* Form Information */}
          <div className="card-custom">
            <h2 className="font24 bold darkColor flexCenter" style={{justifyContent: 'flex-start', marginBottom: '30px'}}>
              <div className="purpleBg radius8 flexCenter" style={{width: '30px', height: '30px', marginRight: '15px'}}>
                <svg className="whiteColor" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Informações do Formulário
            </h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
              <div>
                <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                  Título *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-custom"
                  placeholder="Digite o título do formulário"
                />
                {errors.title && (
                  <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                  Descrição *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-custom"
                  style={{resize: 'none', minHeight: '80px'}}
                  placeholder="Digite a descrição do formulário"
                />
                {errors.description && (
                  <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="card-custom">
            <div className="flexBetween" style={{marginBottom: '30px'}}>
              <h2 className="font24 bold darkColor flexCenter" style={{justifyContent: 'flex-start'}}>
                <div className="greenBg radius8 flexCenter" style={{width: '30px', height: '30px', marginRight: '15px'}}>
                  <svg className="whiteColor" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                Perguntas ({questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-success font14 semiBold flexCenter"
                style={{padding: '10px 20px'}}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{marginRight: '8px'}}>
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Pergunta
              </button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={question.id} className="mb-8 p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pergunta {questionIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                  <div style={{gridColumn: '1 / -1'}}>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Texto da Pergunta *
                    </label>
                    <input
                      {...register(`questions.${questionIndex}.questionText`)}
                      type="text"
                      className="input-custom"
                      placeholder="Digite a pergunta"
                    />
                    {errors.questions?.[questionIndex]?.questionText && (
                      <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                        {errors.questions[questionIndex]?.questionText?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Tipo de Resposta *
                    </label>
                    <select
                      {...register(`questions.${questionIndex}.questionType`, { valueAsNumber: true })}
                      className="input-custom"
                    >
                      <option value={0}>Texto Livre</option>
                      <option value={1}>Número</option>
                      <option value={2}>Múltipla Escolha</option>
                      <option value={3}>Escolha Única</option>
                    </select>
                  </div>

                  {watchedQuestions[questionIndex]?.questionType === 0 && (
                    <div>
                      <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                        Máximo de Caracteres
                      </label>
                      <input
                        {...register(`questions.${questionIndex}.maxCharacters`, { valueAsNumber: true })}
                        type="number"
                        min="0"
                        className="input-custom"
                        placeholder="0 = ilimitado"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      {...register(`questions.${questionIndex}.isRequired`)}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Pergunta obrigatória
                    </label>
                  </div>
                </div>

                {/* Options for Multiple/Single Choice */}
                {(watchedQuestions[questionIndex]?.questionType === 2 || watchedQuestions[questionIndex]?.questionType === 3) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Opções de Resposta</h4>
                      <button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Adicionar Opção
                      </button>
                    </div>

                    {watchedQuestions[questionIndex]?.options?.map((_: any, optionIndex: number) => (
                      <div key={optionIndex} className="mb-4 p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Opção {optionIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Texto da Opção *
                            </label>
                            <input
                              {...register(`questions.${questionIndex}.options.${optionIndex}.text`)}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              placeholder="Digite o texto da opção"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Comentário (opcional)
                            </label>
                            <input
                              {...register(`questions.${questionIndex}.options.${optionIndex}.comment`)}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              placeholder="Comentário para esta opção"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notification Configuration */}
          <div className="bg-white shadow-xl rounded-3xl p-4 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              Configuração de Notificação
            </h2>

            <div className="mb-4">
              <div className="flex items-center">
                <input
                  {...register('notificationConfig.generateNotification')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Gerar notificação após aula específica
                </label>
              </div>
            </div>

            {watchedNotificationConfig.generateNotification && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Curso Gatilho *
                    </label>
                    <select
                      {...register('notificationConfig.triggerCourseId')}
                      className="input-custom"
                    >
                      <option value="">Selecione um curso</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {errors.notificationConfig?.triggerCourseId && (
                      <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                        {errors.notificationConfig.triggerCourseId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Aula Gatilho *
                    </label>
                    <select
                      {...register('notificationConfig.triggerLessonId')}
                      className="input-custom"
                      disabled={!selectedCourseDetails || loadingCourseDetails}
                    >
                      <option value="">
                        {loadingCourseDetails ? 'Carregando aulas...' : 'Selecione uma aula'}
                      </option>
                      {selectedCourseDetails?.lessons?.map((lesson: any) => (
                        <option key={lesson.id} value={lesson.id}>
                          Aula {lesson.order}: {lesson.title}
                        </option>
                      ))}
                    </select>
                    {errors.notificationConfig?.triggerLessonId && (
                      <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                        {errors.notificationConfig.triggerLessonId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                    Método de Entrega *
                  </label>
                  <select
                    {...register('notificationConfig.deliveryMethod', { valueAsNumber: true })}
                    className="input-custom"
                  >
                    <option value={0}>Resposta Imediata</option>
                    <option value={1}>Enviar por E-mail</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Título da Notificação *
                    </label>
                    <input
                      {...register('notificationConfig.notificationTitle')}
                      type="text"
                      className="input-custom"
                      placeholder="Digite o título da notificação"
                    />
                    {errors.notificationConfig?.notificationTitle && (
                      <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                        {errors.notificationConfig.notificationTitle.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                      Mensagem da Notificação *
                    </label>
                    <textarea
                      {...register('notificationConfig.notificationMessage')}
                      rows={3}
                      className="input-custom"
                      style={{resize: 'none', minHeight: '80px'}}
                      placeholder="Digite a mensagem da notificação"
                    />
                    {errors.notificationConfig?.notificationMessage && (
                      <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                        {errors.notificationConfig.notificationMessage.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="card-custom flexBetween" style={{gap: '20px'}}>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="btn-secondary font16 semiBold"
              style={{padding: '15px 30px'}}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary font16 semiBold"
              style={{padding: '15px 30px'}}
            >
              {loading ? (
                <div className="flexCenter">
                  <div className="loading-spinner" style={{marginRight: '10px'}}></div>
                  Criando...
                </div>
              ) : (
                'Criar Formulário'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateFormPage;