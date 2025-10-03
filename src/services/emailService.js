// src/services/emailService.js
import emailjs from '@emailjs/browser';

// Configuración de EmailJS usando variables de entorno
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  FROM_NAME: import.meta.env.VITE_FROM_NAME,
  FROM_EMAIL: import.meta.env.VITE_FROM_EMAIL
};

export const sendPasswordResetEmail = async (email) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    // Si las variables de entorno no están configuradas, usar simulación
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      console.log(`[SIMULACIÓN] Variables de entorno no configuradas`);
      console.log(`[SIMULACIÓN] Código para ${email}: ${resetCode}`);
      
      // Guardar código para verificación
      const resetCodes = JSON.parse(localStorage.getItem('resetCodes') || '{}');
      resetCodes[email] = {
        code: resetCode,
        timestamp: Date.now(),
        used: false
      };
      localStorage.setItem('resetCodes', JSON.stringify(resetCodes));
      
      return {
        success: true,
        message: `[SIMULACIÓN] Código: ${resetCode}. Configure EmailJS para envíos reales`
      };
    }

    // Debug: Mostrar configuración (sin mostrar la clave completa por seguridad)
    console.log('🔧 Configuración EmailJS:', {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
      PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? `${EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 8)}...` : 'No configurado',
      FROM_NAME: EMAILJS_CONFIG.FROM_NAME,
      FROM_EMAIL: EMAILJS_CONFIG.FROM_EMAIL
    });

    // Enviar email real usando EmailJS
    const templateParams = {
      email: email,           // ← La plantilla usa {{email}} no {{to_email}}
      user_name: 'Usuario',   // ← La plantilla usa {{user_name}}
      reset_code: resetCode,  // ← La plantilla usa {{reset_code}}
      app_name: EMAILJS_CONFIG.FROM_NAME || 'Sistema'
    };

    console.log('📧 Template Params enviados:', templateParams);

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    
    // Guardar código para verificación
    const resetCodes = JSON.parse(localStorage.getItem('resetCodes') || '{}');
    resetCodes[email] = {
      code: resetCode,
      timestamp: Date.now(),
      used: false
    };
    localStorage.setItem('resetCodes', JSON.stringify(resetCodes));
    
    return {
      success: true,
      message: 'Código enviado a tu correo electrónico'
    };
    
  } catch (error) {
    console.error('❌ Error enviando email REAL:', error);
    console.error('❌ Error de EmailJS:', error.text || error.message);
    console.error('❌ Status:', error.status);
    console.error('❌ Error completo:', JSON.stringify(error, null, 2));
    
    return {
      success: false,
      message: `Error al enviar el código: ${error.text || error.message || 'Error desconocido'}`
    };
  }
};

export const verifyResetCode = (email, code) => {
  const resetCodes = JSON.parse(localStorage.getItem('resetCodes') || '{}');
  const storedData = resetCodes[email];
  
  if (!storedData) {
    console.log('No se encontró código para:', email);
    return false;
  }
  
  if (storedData.used) {
    console.log('Código ya usado');
    return false;
  }
  
  if (storedData.code !== code) {
    console.log('Código incorrecto');
    return false;
  }
  
  // Verificar si el código no ha expirado (válido por 10 minutos)
  const now = Date.now();
  const codeAge = now - storedData.timestamp;
  const tenMinutes = 10 * 60 * 1000;
  
  if (codeAge >= tenMinutes) {
    console.log('Código expirado');
    return false;
  }
  
  return true;
};

export const markResetCodeAsUsed = (email) => {
  const resetCodes = JSON.parse(localStorage.getItem('resetCodes') || '{}');
  if (resetCodes[email]) {
    resetCodes[email].used = true;
    localStorage.setItem('resetCodes', JSON.stringify(resetCodes));
  }
};

export const clearResetCode = (email) => {
  const resetCodes = JSON.parse(localStorage.getItem('resetCodes') || '{}');
  delete resetCodes[email];
  localStorage.setItem('resetCodes', JSON.stringify(resetCodes));
};