import React from 'react';

interface SignUpScreenProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would collect form data and send it to an API.
    alert('Cadastro realizado com sucesso! (Simulação)');
    onSignUp();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600">Crie sua Conta</h1>
            <p className="mt-2 text-gray-500">Comece a gerenciar sua clínica com TeraClinic.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input type="text" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <input type="text" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input type="date" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <input type="password" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                    <input type="password" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <hr className="my-2 md:col-span-2"/>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Empresa/Clínica</label>
                    <input type="text" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input type="text" required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
            </div>

          <div>
            <button type="submit" className="w-full px-4 py-2 mt-4 font-semibold text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Cadastrar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
            Já tem uma conta?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-green-600 hover:text-green-500">
                Faça login
            </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;