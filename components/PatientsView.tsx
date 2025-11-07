import React, { useState, useMemo } from 'react';
import type { Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';

interface PatientsViewProps {
  onSelectPatient: (patient: Patient) => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
    );
  }, [searchTerm]);

  const NewPatientModal: React.FC = () => {
    const [patientType, setPatientType] = useState<'infantil' | 'adulto'>('infantil');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle form submission, e.g., call an API
        alert('Paciente salvo com sucesso! (Simulação)');
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Novo Paciente</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Nome Completo</label>
                            <input type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">CPF</label>
                            <input type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Data de Nascimento</label>
                            <input type="date" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Tipo</label>
                            <select value={patientType} onChange={e => setPatientType(e.target.value as any)} className="w-full p-2 bg-white border border-gray-300 rounded">
                                <option value="infantil">Infantil</option>
                                <option value="adulto">Adulto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Endereço</label>
                            <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Telefone de Contato</label>
                            <input type="tel" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Email</label>
                            <input type="email" className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        {patientType === 'infantil' && (
                            <>
                                <hr className="md:col-span-2 my-2"/>
                                <h3 className="md:col-span-2 font-semibold text-lg">Dados do Responsável</h3>
                                <div>
                                    <label className="block text-gray-700">Nome do Responsável</label>
                                    <input type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                                 <div>
                                    <label className="block text-gray-700">CPF do Responsável</label>
                                    <input type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                            </>
                        )}
                         <div className="md:col-span-2">
                            <label className="block text-gray-700">Foto (Opcional)</label>
                            <input type="file" className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md">Salvar Paciente</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div>
      {isModalOpen && <NewPatientModal />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
          <p className="mt-1 text-gray-600">Gerencie os registros dos seus pacientes.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
          + Novo Paciente
        </button>
      </div>
      
      <div className="mt-6">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPatients.map(patient => (
          <div key={patient.id} onClick={() => onSelectPatient(patient)} className="p-5 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform">
            <div className="flex items-center">
              <img className="w-16 h-16 rounded-full" src={patient.avatarUrl} alt={patient.name} />
              <div className="ml-4">
                <p className="text-lg font-bold text-gray-800">{patient.name}</p>
                <p className="text-sm text-gray-500">CPF: {patient.cpf}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><span className="font-semibold">Responsável:</span> {patient.guardianName}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Contato:</span> {patient.contact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientsView;