import { useState, useEffect } from 'react';

export const usePaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState({
    hasAccess: false,
    paymentRecord: null,
    loading: true
  });

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = () => {
    try {
      const accessGranted = localStorage.getItem('accessGranted') === 'true';
      const paymentRecord = localStorage.getItem('paymentRecord');
      
      setPaymentStatus({
        hasAccess: accessGranted,
        paymentRecord: paymentRecord ? JSON.parse(paymentRecord) : null,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao verificar status de pagamento:', error);
      setPaymentStatus({
        hasAccess: false,
        paymentRecord: null,
        loading: false
      });
    }
  };

  const grantAccess = (paymentRecord) => {
    localStorage.setItem('accessGranted', 'true');
    localStorage.setItem('paymentRecord', JSON.stringify(paymentRecord));
    setPaymentStatus({
      hasAccess: true,
      paymentRecord: paymentRecord,
      loading: false
    });
  };

  const revokeAccess = () => {
    localStorage.removeItem('accessGranted');
    localStorage.removeItem('paymentRecord');
    setPaymentStatus({
      hasAccess: false,
      paymentRecord: null,
      loading: false
    });
  };

  return {
    ...paymentStatus,
    checkPaymentStatus,
    grantAccess,
    revokeAccess
  };
};

export default usePaymentStatus;