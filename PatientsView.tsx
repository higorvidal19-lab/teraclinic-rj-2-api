import React, { useState, useMemo } from 'react';
import type { Patient } from '../types';
import { useClinic } from '../App';
import { PencilIcon } from './icons/Icons';
import Avatar from './ui/Avatar';

interface PatientsViewProps {
  onSelectPatient: (patient: Patient) => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ onSelectPatient }) => {
  const { patients, setPatients } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
    );
  }, [searchTerm, patients]);

  const handleOpenModal = (patient: Patient | null) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPatient(null);
    setIsModalOpen(false);
  };

  const PatientModal: React.FC<{ patient: Patient | null, onClose: () => void }> = ({ patient, onClose }) => {
    const isEditing = !!patient;
    const [patientType, setPatientType] = useState<'infantil' | 'adulto'>(patient?.type || 'infantil');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const patientData = {
            name: formData.get('name') as string,
            cpf: formData.get('cpf') as string,
            dateOfBirth: formData.get('dob') as string,
            type: patientType,
            address: formData.get('address') as string,
            contact: formData.get('contact') as string,
            email: formData.get('email') as string,
            guardianName: formData.get('guardianName') as string || 'N/A',
            guardianCpf: formData.get('guardianCpf') as string,
        };

        if (isEditing) {
            const updatedPatient = { ...patient, ...patientData };
            setPatients(prev => prev.map(p => p.id === patient.id ? updatedPatient : p));
            alert('Paciente atualizado com sucesso!');
        } else {
             const newPatient: Patient = {
                id: `patient-${Date.now()}`,
                ...patientData,
                avatarUrl: null, // New patients start with a null avatar
            };
            setPatients(prev => [...prev, newPatient]);
            alert('Paciente salvo com sucesso!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Paciente' : 'Novo Paciente'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Nome Completo</label>
                            <input name="name" type="text" required defaultValue={patient?.name} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">CPF</label>
                            <input name="cpf" type="text" required defaultValue={patient?.cpf} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Data de Nascimento</label>
                            <input name="dob" type="date" required defaultValue={patient?.dateOfBirth} className="w-full p-2 bg-white border border-gray-300 rounded"/>
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
                            <input name="address" type="text" defaultValue={patient?.address} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Telefone de Contato</label>
                            <input name="contact" type="tel" required defaultValue={patient?.contact} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Email</label>
                            <input name="email" type="email" defaultValue={patient?.email} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        {patientType === 'infantil' && (
                            <>
                                <hr className="md:col-span-2 my-2"/>
                                <h3 className="md:col-span-2 font-semibold text-lg">Dados do Responsável</h3>
                                <div>
                                    <label className="block text-gray-700">Nome do Responsável</label>
                                    <input name="guardianName" type="text" required={patientType === 'infantil'} defaultValue={patient?.guardianName} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                                 <div>
                                    <label className="block text-gray-700">CPF do Responsável</label>
                                    <input name="guardianCpf" type="text" defaultValue={patient?.guardianCpf} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                            </>
                        )}
                         <div className="md:col-span-2">
                            <label className="block text-gray-700">Foto (Opcional)</label>
                            <input type="file" className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div>
      {isModalOpen && <PatientModal patient={editingPatient} onClose={handleCloseModal} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
          <p className="mt-1 text-gray-600">Gerencie os registros dos seus pacientes.</p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
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

       {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPatients.map(patient => (
            <div key={patient.id} onClick={() => onSelectPatient(patient)} className="relative p-5 bg-white rounded-lg shadow-md cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-transform">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(patient); }} 
                  className="absolute top-2 right-2 p-2 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-green-600 transition-opacity"
                  title="Editar Paciente"
                >
                    <PencilIcon />
                </button>
                <div className="flex items-center">
                <Avatar name={patient.name} avatarUrl={patient.avatarUrl} size="lg" />
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
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500">Nenhum paciente encontrado. Clique em "+ Novo Paciente" para começar.</p>
            </div>
        )}
    </div>
  );
};

export default PatientsView;