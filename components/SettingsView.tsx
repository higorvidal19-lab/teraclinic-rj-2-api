import React, { useState, useRef } from 'react';
import { useClinic } from '../App';

const SettingsView: React.FC = () => {
    const { settings, setSettings } = useClinic();
    const [clinicName, setClinicName] = useState(settings.name);
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSettings({ name: clinicName, logoUrl: logoPreview });
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>
            
            <div className="p-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informações da Clínica</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Nome da Clínica</label>
                                <input
                                    type="text"
                                    id="clinicName"
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Logo da Clínica</label>
                                <div className="mt-1 flex items-center">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 rounded-full object-cover"/>
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            Logo
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoChange}
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Alterar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Segurança</h2>
                        <div className="max-w-md space-y-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                                <input type="password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                           </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                                <input type="password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                           </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsView;