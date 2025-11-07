import React from 'react';
import { signUpUser } from '../services/authService';

interface SignUpScreenProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin }) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const fd = new FormData(form);

  const nome = (fd.get('nome') as string) || '';
  const email = (fd.get('email') as string) || '';
  const senha = (fd.get('senha') as string) || '';
  const confirmar = (fd.get('confirmar_senha') as string) || '';

  if (!nome || !email || !senha) {
    alert('Por favor preencha nome, email e senha.');
    return;
  }

  if (senha !== confirmar) {
    alert('As senhas não conferem.');
    return;
  }

  try {
    // signUpUser já está no seu projeto (services/authService.ts)
    await signUpUser(email, senha, nome);
    alert('Cadastro realizado com sucesso! Verifique seu e-mail se necessário.');
    onSignUp(); // mantém o comportamento anterior (navegar / fechar modal)
  } catch (err: any) {
    console.error('Erro no cadastro:', err);
    const msg = err?.message || JSON.stringify(err);
    alert('Erro ao cadastrar: ' + msg);
  }
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
      <input
        name="nome"
        type="text"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        name="email"
        type="email"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">CPF</label>
      <input
        name="cpf"
        type="text"
        inputMode="numeric"
        pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
      <input
        name="nascimento"
        type="date"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Senha</label>
      <input
        name="senha"
        type="password"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
      <input
        name="confirmar_senha"
        type="password"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <hr className="my-2 md:col-span-2" />

    <div>
      <label className="block text-sm font-medium text-gray-700">Nome da Empresa/Clínica</label>
      <input
        name="empresa"
        type="text"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Endereço</label>
      <input
        name="endereco"
        type="text"
        required
        className="w-full p-2 mt-1 bg-white border rounded-md"
      />
    </div>
  </div>

  <div>
    <button
      type="submit"
      className="w-full px-4 py-2 mt-4 font-semibold text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
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