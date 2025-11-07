import React from 'react';
import { useClinic } from '../App';
import { UserRole } from '../types';

const AccountManagementView: React.FC = () => {
    const { settings, setSettings, users } = useClinic();
    
    const currentTherapists = users.filter(u => u.role === UserRole.THERAPIST).length;
    const currentAdmins = users.filter(u => u.role === UserRole.ADMIN).length;

    const canIncreaseTherapists = currentTherapists >= settings.therapistQuota;
    const canDecreaseTherapists = settings.therapistQuota > currentTherapists;

    const canIncreaseAdmins = currentAdmins >= settings.adminQuota;
    const canDecreaseAdmins = settings.adminQuota > currentAdmins;

    const handleIncreaseTherapist = () => {
        setSettings(prev => ({ ...prev, therapistQuota: prev.therapistQuota + 1 }));
    };

    const handleDecreaseTherapist = () => {
        if (canDecreaseTherapists) {
            setSettings(prev => ({ ...prev, therapistQuota: Math.max(0, prev.therapistQuota - 1) }));
        }
    };

     const handleIncreaseAdmin = () => {
        setSettings(prev => ({ ...prev, adminQuota: prev.adminQuota + 1 }));
    };

    const handleDecreaseAdmin = () => {
        if (canDecreaseAdmins) {
            setSettings(prev => ({ ...prev, adminQuota: Math.max(0, prev.adminQuota - 1) }));
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestão de Conta e Assinatura</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Plan */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Seu Plano Atual</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Terapeutas</span>
                                <span className="font-bold text-lg">{currentTherapists} / {settings.therapistQuota}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div 
                                    className="bg-green-500 h-2.5 rounded-full" 
                                    style={{ width: `${(currentTherapists / settings.therapistQuota) * 100}%` }}>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Administradores</span>
                                 <span className="font-bold text-lg">{currentAdmins} / {settings.adminQuota}</span>
                            </div>
                             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div 
                                    className="bg-blue-500 h-2.5 rounded-full" 
                                    style={{ width: `${(currentAdmins / settings.adminQuota) * 100}%` }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manage Plan */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                     <h2 className="text-xl font-semibold mb-4 border-b pb-2">Gerenciar Licenças</h2>
                     <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Terapeutas</h3>
                             <p className="text-sm text-gray-600 mb-4">Ajuste o número de licenças de terapeutas para sua clínica.</p>
                             <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <button 
                                    onClick={handleDecreaseTherapist}
                                    disabled={!canDecreaseTherapists}
                                    className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-white bg-red-500 rounded-full hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    title={!canDecreaseTherapists ? "Não é possível reduzir abaixo do número de usuários atuais" : "Remover 1 licença"}
                                >
                                    -
                                </button>
                                <span className="text-4xl font-bold text-gray-800 w-20 text-center">{settings.therapistQuota}</span>
                                <button 
                                    onClick={handleIncreaseTherapist}
                                    disabled={!canIncreaseTherapists}
                                    className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    title={!canIncreaseTherapists ? "Ainda há licenças disponíveis para uso" : "Adicionar 1 licença"}
                                >
                                    +
                                </button>
                             </div>
                             {!canIncreaseTherapists && (
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Você só pode adicionar mais licenças quando todas as atuais estiverem em uso.
                                </p>
                             )}
                        </div>
                         <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Administradores</h3>
                             <p className="text-sm text-gray-600 mb-4">Ajuste o número de licenças de administradores.</p>
                             <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <button 
                                    onClick={handleDecreaseAdmin}
                                    disabled={!canDecreaseAdmins}
                                    className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-white bg-red-500 rounded-full hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    title={!canDecreaseAdmins ? "Não é possível reduzir abaixo do número de usuários atuais" : "Remover 1 licença"}
                                >
                                    -
                                </button>
                                <span className="text-4xl font-bold text-gray-800 w-20 text-center">{settings.adminQuota}</span>
                                <button 
                                    onClick={handleIncreaseAdmin}
                                    disabled={!canIncreaseAdmins}
                                    className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    title={!canIncreaseAdmins ? "Ainda há licenças disponíveis para uso" : "Adicionar 1 licença"}
                                >
                                    +
                                </button>
                             </div>
                              {!canIncreaseAdmins && (
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Você só pode adicionar mais licenças quando todas as atuais estiverem em uso.
                                </p>
                             )}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagementView;