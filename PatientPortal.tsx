
import React, { useState, useMemo } from 'react';
import type { Patient, ChatMessage } from '../types';
import { useClinic } from '../App';
import { UserRole } from '../types';
import { SendIcon, LogoutIcon } from './icons/Icons';

interface PatientPortalProps {
  patient: Patient;
  onLogout: () => void;
}

const PatientPortal: React.FC<PatientPortalProps> = ({ patient, onLogout }) => {
    const { evolutions, users, chatMessages, setChatMessages } = useClinic();

    const externalEvolutions = useMemo(() => 
        evolutions.filter(e => e.patientId === patient.id && !e.isInternal).sort((a,b) => b.date.getTime() - a.date.getTime()),
        [evolutions, patient.id]
    );
    
    // This is a simplification. A real app would have a clear link between patient and therapist.
    const assignedTherapist = useMemo(() => 
        users.find(u => u.role === UserRole.THERAPIST),
        [users]
    );
    
    const portalChatMessages = useMemo(() =>
        chatMessages.filter(m => m.patientId === patient.id && !m.isInternal).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()),
        [chatMessages, patient.id]
    );

    const [newMessage, setNewMessage] = useState('');

    const getTherapistName = (therapistId: string) => users.find(u => u.id === therapistId)?.name || 'Terapeuta';

    const handleSendMessage = () => {
        if(newMessage.trim() === '') return;
        
        const message: ChatMessage = {
            id: `msg-ext-${Date.now()}`,
            patientId: patient.id,
            senderId: 'patient',
            receiverId: assignedTherapist?.id || 'therapist',
            timestamp: new Date(),
            content: newMessage,
            isInternal: false,
        };
        
        setChatMessages(prevMessages => [...prevMessages, message]);
        setNewMessage('');
    };

    return (
        <div className="p-4 bg-green-50 min-h-screen sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between pb-4 border-b-2 border-green-200">
                    <div>
                        <h1 className="text-3xl font-bold text-green-700">Portal do Paciente</h1>
                        <p className="text-gray-600">Bem-vindo(a), {patient.guardianName}!</p>
                    </div>
                    <button onClick={onLogout} className="flex items-center px-4 py-2 font-semibold text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-100">
                        <LogoutIcon />
                        Sair
                    </button>
                </header>

                <main className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
                    {/* Evolutions */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800">Acompanhamento de Evoluções</h2>
                        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {externalEvolutions.length > 0 ? externalEvolutions.map(evo => (
                                <div key={evo.id} className="p-4 border rounded-lg bg-green-50">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <p><strong>{getTherapistName(evo.therapistId)}</strong></p>
                                        <p>{evo.date.toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{evo.content}</p>
                                </div>
                            )) : <p className="text-gray-500">Nenhuma evolução externa registrada ainda.</p>}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Chat com {assignedTherapist?.name || 'o Terapeuta'}</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {portalChatMessages.map(msg => {
                                const isFromPatient = msg.senderId === 'patient';
                                return (
                                    <div key={msg.id} className={`flex my-2 ${isFromPatient ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-4 py-2 rounded-lg ${isFromPatient ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 ${isFromPatient ? 'text-green-200' : 'text-gray-500'}`}>{msg.timestamp.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Digite sua mensagem..." 
                                    className="flex-1 p-2 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage} className="p-3 text-white bg-green-500 rounded-r-lg hover:bg-green-600">
                                    <SendIcon/>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientPortal;