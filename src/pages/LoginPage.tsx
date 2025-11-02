import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest } from '../types';

const schema = yup.object({
  usernameOrEmail: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, hasRequiredRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated with proper role
  if (isAuthenticated && hasRequiredRole) {
    return <Navigate to="/courses" replace />;
  }

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      const { token, user } = response.data;

      if (user.role <= 0) {
        setError('Usuário sem permissão. É necessário ter uma role maior que 0.');
        return;
      }

      login(user, token);
      navigate('/courses');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flexCenter gradientPrimary">
      <div className="max-w-md w-full">
        <div className="card-custom">
          <div className="textCenter" style={{marginBottom: '30px'}}>
            <div className="flexCenter" style={{marginBottom: '20px'}}>
              <div className="purpleBg radius8 flexCenter" style={{width: '60px', height: '60px'}}>
                <svg className="whiteColor" width="30" height="30" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <h2 className="font40 extraBold darkColor" style={{marginBottom: '10px'}}>
              Sistema de Gerenciamento
            </h2>
            <p className="font18 greyColor">
              Faça login para acessar seus cursos
            </p>
          </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                Usuário ou Email
              </label>
              <input
                {...register('usernameOrEmail')}
                type="text"
                className="input-custom"
                placeholder="Digite seu usuário ou email"
              />
              {errors.usernameOrEmail && (
                <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>
            <div>
              <label className="font14 semiBold darkColor" style={{display: 'block', marginBottom: '8px'}}>
                Senha
              </label>
              <input
                {...register('password')}
                type="password"
                className="input-custom"
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <p className="font12" style={{color: '#f44336', marginTop: '5px'}}>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="notification-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary x100 font18 semiBold"
            style={{padding: '15px'}}
          >
            {isLoading ? (
              <div className="flexCenter">
                <div className="loading-spinner" style={{marginRight: '10px'}}></div>
                Entrando...
              </div>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;