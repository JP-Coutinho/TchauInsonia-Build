// Serviço de email alternativo sem dependências externas
// Usa FormSubmit.co como fallback para EmailJS

// Função para gerar senha aleatória
export const generateRandomPassword = (length = 10) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Função para obter configurações do EmailJS
const getEmailConfig = () => {
  const savedConfig = localStorage.getItem('emailConfig');
  if (savedConfig) {
    return JSON.parse(savedConfig);
  }
  
  // Configurações padrão
  return {
    emailServiceId: 'service_tchauinsonia',
    emailTemplateId: 'template_payment_confirmation',
    emailPublicKey: 'your_public_key_here',
    fromEmail: 'ordepoaoj@live.com',
    fromName: 'Tchau Insônia'
  };
};

// Função principal de envio usando EmailJS (versão compatível)
export const sendPaymentConfirmationEmail = async (userData, paymentData, generatedPassword) => {
  try {
    // Tentar envio via EmailJS primeiro
    const emailjsResult = await sendViaEmailJS(userData, paymentData, generatedPassword);
    if (emailjsResult.success) {
      return emailjsResult;
    }
    
    // Se falhar, tentar via FormSubmit
    console.log('EmailJS falhou, tentando FormSubmit...');
    return await sendViaFormSubmit(userData, paymentData, generatedPassword);
    
  } catch (error) {
    console.error('❌ Erro em todos os métodos de envio:', error);
    
    // Retornar sucesso simulado para não bloquear o pagamento
    return {
      success: false,
      error: error.message,
      password: generatedPassword,
      fallback: true
    };
  }
};

// Método 1: EmailJS (método principal)
const sendViaEmailJS = async (userData, paymentData, generatedPassword) => {
  try {
    // Importação dinâmica para evitar erros de parsing
    const emailjs = await import('@emailjs/browser');
    
    const config = getEmailConfig();
    
    if (!config.emailServiceId || !config.emailTemplateId || !config.emailPublicKey) {
      throw new Error('Configurações de EmailJS incompletas');
    }
    
    // Inicializar EmailJS
    emailjs.init(config.emailPublicKey);
    
    const templateParams = {
      to_email: userData.email,
      to_name: userData.displayName,
      from_name: config.fromName,
      from_email: config.fromEmail,
      user_name: userData.displayName,
      user_email: userData.email,
      payment_amount: paymentData.amount.toFixed(2).replace('.', ','),
      payment_date: new Date().toLocaleDateString('pt-BR'),
      payment_time: new Date().toLocaleTimeString('pt-BR'),
      card_last4: paymentData.cardLast4,
      transaction_id: paymentData.transactionId || 'TXN' + Date.now(),
      generated_password: generatedPassword,
      login_url: window.location.origin + '/login',
      support_email: config.fromEmail
    };
    
    const response = await emailjs.send(
      config.emailServiceId,
      config.emailTemplateId,
      templateParams
    );
    
    if (response.status === 200) {
      console.log('✅ Email enviado via EmailJS!');
      return {
        success: true,
        method: 'EmailJS',
        messageId: response.text,
        password: generatedPassword
      };
    } else {
      throw new Error('Falha no EmailJS: ' + response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro no EmailJS:', error);
    throw error;
  }
};

// Método 2: FormSubmit.co (fallback)
const sendViaFormSubmit = async (userData, paymentData, generatedPassword) => {
  try {
    const formData = new FormData();
    
    // Configurar FormSubmit
    formData.append('_to', userData.email);
    formData.append('_cc', 'ordepoaoj@live.com');
    formData.append('_subject', '🎉 Pagamento Confirmado - Tchau Insônia');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Dados do email
    formData.append('Nome', userData.displayName);
    formData.append('Email', userData.email);
    formData.append('Valor_Pagamento', 'R$ ' + paymentData.amount.toFixed(2).replace('.', ','));
    formData.append('Data_Pagamento', new Date().toLocaleDateString('pt-BR'));
    formData.append('Hora_Pagamento', new Date().toLocaleTimeString('pt-BR'));
    formData.append('Cartao_Final', '**** **** **** ' + paymentData.cardLast4);
    formData.append('Senha_Acesso', generatedPassword);
    formData.append('Link_Login', window.location.origin + '/login');
    formData.append('Status', 'Pagamento Aprovado');
    
    const response = await fetch('https://formsubmit.co/ajax/ordepoaoj@live.com', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email enviado via FormSubmit!');
      return {
        success: true,
        method: 'FormSubmit',
        messageId: 'formsubmit_' + Date.now(),
        password: generatedPassword
      };
    } else {
      throw new Error('Falha no FormSubmit: ' + response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro no FormSubmit:', error);
    throw error;
  }
};

// Método 3: Simulação local (para desenvolvimento)
export const sendViaLocalSimulation = async (userData, paymentData, generatedPassword) => {
  console.log('📧 SIMULAÇÃO DE EMAIL:');
  console.log('Para:', userData.email);
  console.log('Nome:', userData.displayName);
  console.log('Valor:', 'R$ ' + paymentData.amount.toFixed(2).replace('.', ','));
  console.log('Senha:', generatedPassword);
  console.log('Data:', new Date().toLocaleString('pt-BR'));
  
  // Salvar no localStorage para debug
  const emailLog = {
    to: userData.email,
    name: userData.displayName,
    amount: paymentData.amount,
    password: generatedPassword,
    timestamp: new Date().toISOString(),
    method: 'simulation'
  };
  
  const existingLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]');
  existingLogs.push(emailLog);
  localStorage.setItem('emailLogs', JSON.stringify(existingLogs));
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    method: 'Simulação Local',
    messageId: 'sim_' + Date.now(),
    password: generatedPassword,
    debug: emailLog
  };
};

// Função para verificar se deve usar simulação
export const shouldUseSimulation = () => {
  return process.env.NODE_ENV === 'development' || 
         localStorage.getItem('useEmailSimulation') === 'true';
};

// Template HTML melhorado
export const generateEmailTemplate = (userData, paymentData, password) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pagamento Confirmado - Tchau Insônia</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-size: 2.2rem; margin-bottom: 10px; }
            .header p { font-size: 1.1rem; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .success-badge { background: #28a745; color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; margin-bottom: 25px; font-weight: bold; }
            .info-section { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #007bff; }
            .info-section h3 { color: #333; margin-bottom: 15px; }
            .password-section { background: #e8f5e8; border: 2px solid #28a745; padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; }
            .password { font-size: 2rem; font-weight: bold; color: #28a745; letter-spacing: 3px; font-family: 'Courier New', monospace; margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
            .cta-button { display: inline-block; background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
            .features { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; }
            .features ul { list-style: none; }
            .features li { margin: 10px 0; padding-left: 25px; position: relative; }
            .features li:before { content: '✓'; position: absolute; left: 0; color: #28a745; font-weight: bold; }
            .footer { background: #333; color: white; padding: 30px; text-align: center; font-size: 0.9rem; }
            .footer a { color: #007bff; text-decoration: none; }
            @media (max-width: 600px) {
                .container { margin: 0; }
                .header, .content, .footer { padding: 20px; }
                .password { font-size: 1.5rem; letter-spacing: 2px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌙 Tchau Insônia</h1>
                <p>Sua jornada para um sono reparador começa agora!</p>
            </div>
            
            <div class="content">
                <div class="success-badge">✅ PAGAMENTO CONFIRMADO</div>
                
                <h2>Olá ${userData.displayName}!</h2>
                <p>Parabéns! Seu pagamento foi processado com sucesso e você agora tem acesso completo à plataforma Tchau Insônia.</p>
                
                <div class="info-section">
                    <h3>📋 Detalhes do Pagamento</h3>
                    <p><strong>Valor:</strong> R$ ${paymentData.amount.toFixed(2).replace('.', ',')}</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                    <p><strong>Cartão:</strong> **** **** **** ${paymentData.cardLast4}</p>
                    <p><strong>Status:</strong> ✅ Aprovado</p>
                    <p><strong>ID da Transação:</strong> ${paymentData.transactionId || 'TXN' + Date.now()}</p>
                </div>
                
                <div class="password-section">
                    <h3>🔐 Sua Senha de Acesso</h3>
                    <p>Use esta senha para fazer login na plataforma:</p>
                    <div class="password">${password}</div>
                    <p><small>⚠️ <strong>Importante:</strong> Guarde esta senha em local seguro. Você pode alterá-la após o primeiro login.</small></p>
                </div>
                
                <div style="text-align: center;">
                    <a href="${window.location.origin}/login" class="cta-button">🚀 ACESSAR PLATAFORMA</a>
                </div>
                
                <div class="info-section">
                    <h3>📝 Próximos Passos</h3>
                    <ol>
                        <li>Clique no botão acima ou acesse: <strong>${window.location.origin}/login</strong></li>
                        <li>Faça login com seu email: <strong>${userData.email}</strong></li>
                        <li>Use a senha fornecida acima</li>
                        <li>Complete o questionário completo de avaliação da insônia</li>
                        <li>Receba seu relatório personalizado</li>
                        <li>Explore todos os recursos premium</li>
                    </ol>
                </div>
                
                <div class="features">
                    <h3>✨ O que você pode fazer agora:</h3>
                    <ul>
                        <li>Responder ao questionário completo de avaliação da insônia</li>
                        <li>Receber seu relatório detalhado e personalizado</li>
                        <li>Acessar a Sala de Bem-Estar com conteúdos exclusivos</li>
                        <li>Explorar materiais educativos sobre higiene do sono</li>
                        <li>Receber acompanhamento e orientações personalizadas</li>
                        <li>Baixar guias e recursos em PDF</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Precisa de ajuda?</strong></p>
                <p>Entre em contato conosco: <a href="mailto:ordepoaoj@live.com">ordepoaoj@live.com</a></p>
                <p style="margin-top: 20px;">© 2025 Tchau Insônia - Todos os direitos reservados</p>
                <p>Este é um email automático, não responda a esta mensagem.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export default {
  generateRandomPassword,
  sendPaymentConfirmationEmail,
  sendViaLocalSimulation,
  shouldUseSimulation,
  generateEmailTemplate
};