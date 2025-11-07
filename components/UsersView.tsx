import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { MOCK_USERS } from '../constants';
import { UserRole } from '../types';
import { PlusIcon } from './icons/Icons';
import { useClinic } from '../App';

interface UsersViewProps {
    currentUser: User;
}

const therapistCouncils = [
    'CFP', 'CRP', 'COFFITO', 'CREFITO', 'CFFa', 'CREFONO', 
    'CFESS', 'CRESS', 'COFEN', 'COREN', 'CFM', 'CRM'
];

const UsersView: React.FC<UsersViewProps> = ({ currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { settings } = useClinic();
    
    const users = MOCK_USERS.filter(u => u.id !== currentUser.id);
    const therapists = users.filter(u => u.role === UserRole.THERAPIST);
    const admins = users.filter(u => u.role === UserRole.ADMIN);

    const isQuotaFull = therapists.length >= settings.therapistQuota && admins.length >= settings.adminQuota;

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const UserModal: React.FC<{ user: User | null, onClose: () => void }> = ({ user, onClose }) => {
        const [role, setRole] = useState<UserRole>(user?.role || UserRole.THERAPIST);
        const isEditing = !!user;

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            if (!isEditing) {
                if (role === UserRole.THERAPIST && therapists.length >= settings.therapistQuota) {
                    alert('Limite de terapeutas atingido. Aumente o limite na Gestão de Conta.');
                    return;
                }
                if (role === UserRole.ADMIN && admins.length >= settings.adminQuota) {
                    alert('Limite de administradores atingido.');
                    return;
                }
            }

            alert(`Usuário ${isEditing ? 'atualizado' : 'salvo'} com sucesso! (Simulação)`);
            onClose();
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Nome Completo</label>
                                <input type="text" required defaultValue={user?.name} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input type="email" required defaultValue={user?.email} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                            </div>
                            <div>
                                <label className="block text-gray-700">CPF</label>
                                <input type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                            </div>
                            <div>
                                <label className="block text-gray-700">Endereço</label>
                                <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded"/>
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-gray-700">Senha</label>
                                    <input type="password" required={!isEditing} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                            )}
                             <div>
                                <label className="block text-gray-700">Função</label>
                                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-2 bg-white border border-gray-300 rounded">
                                    <option value={UserRole.THERAPIST}>Terapeuta</option>
                                    <option value={UserRole.ADMIN}>Administrativo</option>
                                </select>
                            </div>
                        </div>

                        {role === UserRole.THERAPIST && (
                            <>
                                <hr className="my-4"/>
                                <h3 className="font-semibold text-lg">Informações Profissionais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-gray-700">Conselho</label>
                                        <select defaultValue={user?.councilType} className="w-full p-2 bg-white border border-gray-300 rounded">
                                            {therapistCouncils.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Número do Conselho</label>
                                        <input type="text" defaultValue={user?.councilNumber} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                    </div>
                                </div>
                            </>
                        )}
                        
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
            {isModalOpen && <UserModal user={editingUser} onClose={handleCloseModal} />}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
                    <p className="mt-1 text-gray-600">Adicione, remova e edite usuários do sistema.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  disabled={isQuotaFull}
                  className="flex items-center px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  title={isQuotaFull ? "Todas as licenças de usuários foram utilizadas." : "Adicionar novo usuário"}
                >
                    <PlusIcon /> <span className="ml-2 hidden sm:inline">Novo Usuário</span>
                </button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="w-10 h-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                {user.councilType && <div className="text-xs text-gray-500">{user.councilType}: {user.councilNumber}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-500">{user.email}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === UserRole.THERAPIST ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-green-600 hover:text-green-900">Editar</button>
                                        <button className="ml-4 text-red-600 hover:text-red-900">Remover</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersView;