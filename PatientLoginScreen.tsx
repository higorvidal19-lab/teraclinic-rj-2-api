
import React, { useState } from 'react';

interface PatientLoginScreenProps {
  onPatientLogin: (cpf: string, dob: string) => boolean;
  onSwitchToAdminLogin: () => void;
}

const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({ onPatientLogin, onSwitchToAdminLogin }) => {
  const [cpf, setCpf] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onPatientLogin(cpf, dob);
    if (!success) {
      setError('Paciente não encontrado. Verifique os dados.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600">Portal do Paciente</h1>
            <p className="mt-2 text-gray-500">Consulte a evolução e comunique-se com o terapeuta.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF do Paciente</label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                className="w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                className="w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button type="submit" className="w-full px-4 py-2 font-semibold text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Acessar
            </button>
          </div>
        </form>
         <div className="relative flex items-center pt-2">
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
         <div>
            <button onClick={onSwitchToAdminLogin} className="w-full px-4 py-2 font-semibold text-green-600 transition-colors border border-green-500 rounded-md hover:bg-green-50">
                Acessar como Profissional
            </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLoginScreen;