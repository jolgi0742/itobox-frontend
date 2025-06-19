// src/modules/auth/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Key, 
  Send,
  Clock,
  RefreshCw
} from 'lucide-react';

type Step = 'email' | 'sent' | 'reset';

interface ResetData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ResetData>>({});
  const [data, setData] = useState<ResetData>({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ✅ VALIDACIONES
  const validateEmail = (): boolean => {
    const newErrors: Partial<ResetData> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = (): boolean => {
    const newErrors: Partial<ResetData> = {};

    if (!data.code.trim()) {
      newErrors.code = 'Código es requerido';
    } else if (data.code.length !== 6) {
      newErrors.code = 'El código debe tener 6 dígitos';
    }

    if (!data.newPassword.trim()) {
      newErrors.newPassword = 'Nueva contraseña es requerida';
    } else if (data.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (data.newPassword !== data.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ENVIAR EMAIL DE RECUPERACIÓN
  const handleSendEmail = async () => {
    if (!validateEmail()) return;

    setIsSubmitting(true);
    
    try {
      console.log('📧 Enviando email de recuperación a:', data.email);
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Integrar con backend real
      console.log('✅ Email de recuperación enviado');
      setStep('sent');
      
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      setErrors({ email: 'Error enviando email. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ RESETEAR CONTRASEÑA
  const handleResetPassword = async () => {
    if (!validateReset()) return;

    setIsSubmitting(true);
    
    try {
      console.log('🔐 Reseteando contraseña con código:', data.code);
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Integrar con backend real
      console.log('✅ Contraseña reseteada exitosamente');
      alert('✅ ¡Contraseña cambiada exitosamente! Ya puedes iniciar sesión.');
      
      // Navegar a login
      window.location.hash = '#/login';
      
    } catch (error) {
      console.error('❌ Error reseteando contraseña:', error);
      setErrors({ code: 'Código inválido o expirado' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ REENVIAR CÓDIGO
  const handleResendCode = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('🔄 Reenviando código a:', data.email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Código reenviado');
      alert('✅ Código reenviado a tu email');
    } catch (error) {
      console.error('❌ Error reenviando código:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        
        {/* ✅ HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
          <p className="text-purple-100 mt-2">
            {step === 'email' && 'Ingresa tu email para continuar'}
            {step === 'sent' && 'Revisa tu bandeja de entrada'}
            {step === 'reset' && 'Ingresa tu nueva contraseña'}
          </p>
        </div>

        {/* ✅ CONTENIDO */}
        <div className="p-6">

          {/* PASO 1: INGRESAR EMAIL */}
          {step === 'email' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Ingresa tu dirección de email y te enviaremos un código para resetear tu contraseña.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                onClick={handleSendEmail}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Código
                  </>
                )}
              </button>
            </div>
          )}

          {/* PASO 2: EMAIL ENVIADO */}
          {step === 'sent' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Email Enviado!
                </h3>
                <p className="text-gray-600">
                  Hemos enviado un código de 6 dígitos a:
                </p>
                <p className="font-medium text-gray-900 mt-1">{data.email}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-medium text-blue-900 mb-2">¿No ves el email?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Revisa tu carpeta de spam</li>
                  <li>• Verifica que el email sea correcto</li>
                  <li>• El código expira en 15 minutos</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStep('reset')}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Ya tengo el código
                </button>

                <button
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-3 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reenviar Código
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: RESETEAR CONTRASEÑA */}
          {step === 'reset' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Ingresa el código que recibiste por email y tu nueva contraseña.
                </p>
              </div>

              {/* Código de verificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificación (6 dígitos)
                </label>
                <input
                  type="text"
                  value={data.code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setData(prev => ({ ...prev, code: value }));
                  }}
                  className={`w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123456"
                  maxLength={6}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.code}
                  </p>
                )}
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={data.newPassword}
                    onChange={(e) => setData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e) => setData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Repite tu nueva contraseña"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Código expira en */}
              <div className="bg-yellow-50 p-3 rounded-lg flex items-center">
                <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  El código expira en 15 minutos
                </span>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cambiando Contraseña...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </button>
            </div>
          )}

          {/* ✅ BOTÓN VOLVER */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (step === 'reset') {
                  setStep('sent');
                } else if (step === 'sent') {
                  setStep('email');
                } else {
                  window.location.hash = '#/login';
                }
              }}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 'email' ? 'Volver al Login' : 'Volver'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;