// Email service para envio de emails via SMTP
import emailjs from '@emailjs/browser';

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

// Função para gerar senha aleatória
export const generateRandomPassword = (length = 8) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Função para enviar email de confirmação de pagamento com senha
export const sendPaymentConfirmationEmail = async (userData, paymentData, generatedPassword) => {
  try {
    // Obter configurações
    const config = getEmailConfig();
    
    // Verificar se as configurações estão completas
    if (!config.emailServiceId || !config.emailTemplateId || !config.emailPublicKey) {
      throw new Error('Configurações de email incompletas. Acesse /config-email para configurar.');
    }
    
    // Inicializar EmailJS
    emailjs.init(config.emailPublicKey);

    // Parâmetros do template de email
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
      support_email: 'ordepoaoj@live.com'
    };

    // Enviar email
    const response = await emailjs.send(
      config.emailServiceId,
      config.emailTemplateId,
      templateParams
    );

    if (response.status === 200) {
      console.log('✅ Email de confirmação enviado com sucesso!');
      return {
        success: true,
        messageId: response.text,
        password: generatedPassword
      };
    } else {
      throw new Error('Falha no envio do email');
    }

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return {
      success: false,
      error: error.message,
      password: generatedPassword // Retorna a senha mesmo se o email falhar
    };
  }
};

// Função alternativa usando fetch para envio direto (caso prefira uma API própria)
export const sendEmailViaAPI = async (userData, paymentData, generatedPassword) => {
  try {
    const emailData = {
      to: userData.email,
      from: 'ordepoaoj@live.com',
      subject: '🎉 Pagamento Confirmado - Tchau Insônia',
      html: generateEmailTemplate(userData, paymentData, generatedPassword)
    };

    // Esta função requer uma API backend configurada
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        messageId: result.messageId,
        password: generatedPassword
      };
    } else {
      throw new Error('Falha no envio via API');
    }

  } catch (error) {
    console.error('❌ Erro ao enviar email via API:', error);
    return {
      success: false,
      error: error.message,
      password: generatedPassword
    };
  }
};

// Template HTML para o email
const generateEmailTemplate = (userData, paymentData, password) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pagamento Confirmado - Tchau Insônia</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-badge { background: #28a745; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
            .info-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #007bff; }
            .password-box { background: #e8f5e8; border: 2px solid #28a745; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .password { font-size: 24px; font-weight: bold; color: #28a745; letter-spacing: 2px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; display: inline-block; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌙 Tchau Insônia</h1>
                <h2>Pagamento Confirmado!</h2>
            </div>
            
            <div class="content">
                <div class="success-badge">✅ Pagamento Aprovado</div>
                
                <p>Olá <strong>${userData.displayName}</strong>,</p>
                
                <p>Seu pagamento foi processado com sucesso! Agora você tem acesso completo à plataforma Tchau Insônia.</p>
                
                <div class="info-box">
                    <h3>📋 Detalhes do Pagamento</h3>
                    <p><strong>Valor:</strong> R$ ${paymentData.amount.toFixed(2).replace('.', ',')}</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                    <p><strong>Cartão:</strong> **** **** **** ${paymentData.cardLast4}</p>
                    <p><strong>Status:</strong> Aprovado</p>
                </div>
                
                <div class="password-box">
                    <h3>🔐 Sua Senha de Acesso</h3>
                    <p>Use esta senha para acessar sua conta:</p>
                    <div class="password">${password}</div>
                    <p><small>⚠️ Guarde esta senha em local seguro. Você pode alterá-la após o primeiro login.</small></p>
                </div>
                
                <div class="info-box">
                    <h3>🎯 Próximos Passos</h3>
                    <ol>
                        <li>Acesse a plataforma usando o link abaixo</li>
                        <li>Faça login com seu email: <strong>${userData.email}</strong></li>
                        <li>Use a senha fornecida acima</li>
                        <li>Complete o questionário de avaliação da insônia</li>
                        <li>Acesse todos os conteúdos premium</li>
                    </ol>
                </div>
                
                <div style="text-align: center;">
                    <a href="${window.location.origin}/login" class="button">🚀 Acessar Plataforma</a>
                </div>
                
                <div class="info-box">
                    <h3>✨ O que você pode fazer agora:</h3>
                    <ul>
                        <li>📊 Responder ao questionário completo de insônia</li>
                        <li>📈 Receber seu relatório personalizado</li>
                        <li>🏠 Acessar a Sala de Bem-Estar</li>
                        <li>📚 Explorar conteúdos exclusivos sobre sono</li>
                        <li>💬 Receber acompanhamento personalizado</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Precisa de ajuda? Entre em contato: <strong>ordepoaoj@live.com</strong></p>
                    <p>© 2025 Tchau Insônia - Todos os direitos reservados</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export default {
  generateRandomPassword,
  sendPaymentConfirmationEmail,
  sendEmailViaAPI,
  generateEmailTemplate
};