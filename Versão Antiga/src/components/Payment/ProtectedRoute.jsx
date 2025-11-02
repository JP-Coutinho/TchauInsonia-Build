import React from 'react';
import { usePaymentStatus } from '../hooks/usePaymentStatus';
import AccessRestricted from '../components/Payment/AccessRestricted';

const ProtectedRoute = ({ 
  children, 
  user, 
  formData,
  restrictedMessage = "Esta funcionalidade está disponível apenas para usuários premium.",
  restrictedTitle = "Acesso Premium Necessário"
}) => {
  const { hasAccess, loading } = usePaymentStatus();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        ⏳ Verificando acesso...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <AccessRestricted 
        title={restrictedTitle}
        message={restrictedMessage}
        user={user}
        formData={formData}
      />
    );
  }

  return children;
};

export default ProtectedRoute;