import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => boolean;
  onSwitchToPatientLogin: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: (cpf: string, dob: string, email: string) => boolean;
}

const ForgotPasswordModal: React.FC<{ onClose: () => void, onForgotPassword: (cpf: string, dob: string, email: string) => boolean; }> = ({ onClose, onForgotPassword }) => {
    const [cpf, setCpf] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const success = onForgotPassword(cpf, dob, email);
        if (success) {
            setMessage('Verificação bem-sucedida! Em um aplicativo real, um e-mail de redefinição de senha seria enviado.');
        } else {
            setError('Nenhum usuário encontrado com os dados fornecidos. Verifique as informações.');
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Redefinir Senha</h2>
                {!message ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600">Por favor, insira seus dados para verificarmos sua identidade.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CPF</label>
                            <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                            <input type="date" value={dob} onChange={e => setDob(e.target.value)} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                        </div>
                        {error && <p className="text-sm text-center text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-4 pt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Cancelar</button>
                            <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md">Verificar</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <p className="text-green-700">{message}</p>
                         <div className="flex justify-end mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-white bg-green-500 rounded-md">Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToPatientLogin, onSwitchToSignUp, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(email, password);
    if (!success) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <>
    {showForgotModal && <ForgotPasswordModal onForgotPassword={onForgotPassword} onClose={() => setShowForgotModal(false)} />}
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600">TeraClinic</h1>
            <p className="mt-2 text-gray-500">Bem-vindo! Faça login na sua conta.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-[-1px] rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-none appearance-none rounded-t-md focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-sr" className="sr-only">Senha</label>
              <input
                id="password-sr"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-none appearance-none rounded-b-md focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button type="button" onClick={() => setShowForgotModal(true)} className="font-medium text-green-600 hover:text-green-500">
                Esqueci minha senha
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button type="submit" className="w-full px-4 py-2 font-semibold text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Entrar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
            Não tem uma conta?{' '}
            <button onClick={onSwitchToSignUp} className="font-medium text-green-600 hover:text-green-500">
                Cadastre-se
            </button>
        </p>
        
        <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink px-3 text-sm text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
            <button onClick={onSwitchToPatientLogin} className="w-full px-4 py-2 font-semibold text-green-600 transition-colors border border-green-500 rounded-md hover:bg-green-50">
                Acessar como Paciente ou Responsável
            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginScreen;