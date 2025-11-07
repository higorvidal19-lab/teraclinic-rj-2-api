import React, { useState, useMemo } from 'react';
import type { Patient, User, Evolution, ChatMessage } from '../types';
import { useClinic } from '../App';
import { generateEvolution } from '../services/geminiService';
import LoadingSpinner from './ui/LoadingSpinner';
import { WandIcon, SendIcon, UploadIcon, PencilIcon } from './icons/Icons';
import Avatar from './ui/Avatar';

interface PatientDetailViewProps {
  patient: Patient;
  user: User;
  onBack: () => void;
}

type Tab = 'evolutions' | 'chatInternal' | 'chatExternal' | 'documents';

interface ChatWindowProps {
    messages: ChatMessage[];
    onSendMessage: () => void;
    newMessage: string;
    setNewMessage: (value: string) => void;
    user: User;
    patient: Patient;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, newMessage, setNewMessage, user, patient }) => {
    const { users } = useClinic();
    const getSender = (senderId: string) => {
      if (senderId === 'patient') return { name: patient.guardianName, avatarUrl: patient.avatarUrl };
      return users.find(u => u.id === senderId);
    }

    return (
        <div className="flex flex-col h-[60vh] bg-white rounded-lg shadow-md">
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => {
                    const sender = getSender(msg.senderId);
                    const isMe = msg.senderId === user.id;
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 my-2 ${isMe ? 'justify-end' : ''}`}>
                            {!isMe && sender && <Avatar name={sender.name || ''} avatarUrl={sender.avatarUrl} size="sm" />}
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMe ? 'bg-green-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {!isMe && sender && <p className="text-xs font-bold text-green-700">{sender?.name}</p>}
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${isMe ? 'text-green-200' : 'text-gray-500'}`}>{msg.timestamp.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                            </div>
                            {isMe && <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />}
                        </div>
                    )
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
                        onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    />
                    <button onClick={onSendMessage} className="p-3 text-white bg-green-500 rounded-r-lg hover:bg-green-600"><SendIcon/></button>
                </div>
            </div>
        </div>
    );
};

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, user, onBack }) => {
  const { users, evolutions, setEvolutions, chatMessages, setChatMessages, documents, patients, setPatients } = useClinic();
  const [activeTab, setActiveTab] = useState<Tab>('evolutions');
  const [evolutionType, setEvolutionType] = useState<'internal' | 'external'>('internal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const currentPatientData = useMemo(() => patients.find(p => p.id === patient.id) || patient, [patients, patient]);

  const patientEvolutions = useMemo(() => 
    evolutions.filter(e => e.patientId === patient.id).sort((a,b) => b.date.getTime() - a.date.getTime()),
    [evolutions, patient.id]
  );
  
  const internalChatMessages = useMemo(() =>
      chatMessages.filter(m => m.patientId === patient.id && m.isInternal).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()),
      [chatMessages, patient.id]
  );
  
  const externalChatMessages = useMemo(() =>
      chatMessages.filter(m => m.patientId === patient.id && !m.isInternal).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()),
      [chatMessages, patient.id]
  );
  
  const internalEvolutions = patientEvolutions.filter(e => e.isInternal);
  const externalEvolutions = patientEvolutions.filter(e => !e.isInternal);
  
  const patientDocuments = documents.filter(d => d.patientId === patient.id).sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

  const getTherapistName = (therapistId: string) => users.find(u => u.id === therapistId)?.name || 'Desconhecido';

  const handleSendMessage = (isInternal: boolean) => {
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      id: `msg-${isInternal ? 'int' : 'ext'}-${Date.now()}`,
      patientId: patient.id,
      senderId: user.id,
      receiverId: isInternal ? 'group' : 'patient',
      timestamp: new Date(),
      content: newMessage,
      isInternal: isInternal,
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

    const EditPatientModal: React.FC<{ patientToEdit: Patient, onClose: () => void }> = ({ patientToEdit, onClose }) => {
    const [patientType, setPatientType] = useState<'infantil' | 'adulto'>(patientToEdit.type);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const updatedPatient = {
            ...patientToEdit,
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

        setPatients(prev => prev.map(p => p.id === patientToEdit.id ? updatedPatient : p));
        alert('Paciente atualizado com sucesso!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Editar Paciente</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Nome Completo</label>
                            <input name="name" type="text" required defaultValue={patientToEdit.name} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">CPF</label>
                            <input name="cpf" type="text" required defaultValue={patientToEdit.cpf} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Data de Nascimento</label>
                            <input name="dob" type="date" required defaultValue={patientToEdit.dateOfBirth} className="w-full p-2 bg-white border border-gray-300 rounded"/>
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
                            <input name="address" type="text" defaultValue={patientToEdit.address} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div>
                            <label className="block text-gray-700">Telefone de Contato</label>
                            <input name="contact" type="tel" required defaultValue={patientToEdit.contact} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Email</label>
                            <input name="email" type="email" defaultValue={patientToEdit.email} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                        </div>
                        {patientType === 'infantil' && (
                            <>
                                <hr className="md:col-span-2 my-2"/>
                                <h3 className="md:col-span-2 font-semibold text-lg">Dados do Responsável</h3>
                                <div>
                                    <label className="block text-gray-700">Nome do Responsável</label>
                                    <input name="guardianName" type="text" required={patientType === 'infantil'} defaultValue={patientToEdit.guardianName} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                                 <div>
                                    <label className="block text-gray-700">CPF do Responsável</label>
                                    <input name="guardianCpf" type="text" defaultValue={patientToEdit.guardianCpf} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                                </div>
                            </>
                        )}
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


  const EvolutionForm: React.FC = () => {
    const [keywords, setKeywords] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!keywords.trim()) return;
        setIsLoading(true);
        setGeneratedText('');
        try {
            const result = await generateEvolution(keywords, patientEvolutions);
            setGeneratedText(result);
        } catch (error) {
            setGeneratedText('Falha ao gerar evolução. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if (!generatedText.trim()) return;

        const newEvolution: Evolution = {
            id: `evo-${Date.now()}`,
            patientId: patient.id,
            therapistId: user.id,
            date: new Date(),
            isInternal: evolutionType === 'internal',
            content: generatedText,
        };

        setEvolutions(prev => [newEvolution, ...prev]);

        setGeneratedText('');
        setKeywords('');
    };

    return (
        <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold">Nova Evolução {evolutionType === 'internal' ? 'Interna' : 'Externa'}</h3>
            <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Digite palavras-chave para a IA (ex: 'demonstrou melhora na comunicação, interagiu com colegas')..."
                className="w-full p-2 mt-2 bg-white border border-gray-300 rounded-md h-24"
            />
            <button onClick={handleGenerate} disabled={isLoading || !keywords.trim()} className="flex items-center justify-center px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400">
                {isLoading ? <LoadingSpinner size="sm" /> : <><WandIcon /> Gerar com IA</>}
            </button>
            {generatedText && (
                 <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Texto Gerado (editável)</label>
                    <textarea
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md h-48"
                    />
                </div>
            )}
             <button onClick={handleSave} disabled={!generatedText || isLoading} className="px-4 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400">Salvar Evolução</button>
        </div>
    );
  }

  const EvolutionList: React.FC<{ evolutions: Evolution[] }> = ({ evolutions }) => (
    <div className="space-y-4">
        {evolutions.map(evo => (
            <div key={evo.id} className="p-4 bg-white border rounded-lg">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p><strong>Terapeuta:</strong> {getTherapistName(evo.therapistId)}</p>
                    <p>{evo.date.toLocaleDateString('pt-BR')}</p>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{evo.content}</p>
            </div>
        ))}
    </div>
  );
  
  return (
    <div>
        {isEditModalOpen && <EditPatientModal patientToEdit={currentPatientData} onClose={() => setIsEditModalOpen(false)} />}
        <button onClick={onBack} className="mb-4 text-green-600 hover:underline">
            &larr; Voltar para a lista de pacientes
        </button>
      <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
        <Avatar name={currentPatientData.name} avatarUrl={currentPatientData.avatarUrl} size="xl" />
        <div className="ml-6">
          <h1 className="flex items-center gap-4 text-3xl font-bold">
            {currentPatientData.name}
             <button 
                onClick={() => setIsEditModalOpen(true)} 
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-green-600"
                title="Editar Paciente"
              >
                <PencilIcon />
            </button>
          </h1>
          <p className="text-gray-600">CPF: {currentPatientData.cpf} | Data Nasc.: {currentPatientData.dateOfBirth}</p>
          <p className="text-gray-600">Responsável: {currentPatientData.guardianName}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button onClick={() => setActiveTab('evolutions')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'evolutions' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Evoluções</button>
            <button onClick={() => setActiveTab('chatInternal')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chatInternal' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Chat Interno</button>
            <button onClick={() => setActiveTab('chatExternal')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'chatExternal' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Chat Externo</button>
            <button onClick={() => setActiveTab('documents')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Documentos</button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'evolutions' && (
            <div>
                <div className="flex space-x-4">
                    <button onClick={() => setEvolutionType('internal')} className={`px-4 py-2 rounded-md ${evolutionType === 'internal' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Uso Interno</button>
                    <button onClick={() => setEvolutionType('external')} className={`px-4 py-2 rounded-md ${evolutionType === 'external' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Uso Externo</button>
                </div>
                <EvolutionForm/>
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Histórico de Evoluções {evolutionType === 'internal' ? 'Internas' : 'Externas'}</h2>
                    { (evolutionType === 'internal' ? internalEvolutions : externalEvolutions).length > 0 ?
                        <EvolutionList evolutions={evolutionType === 'internal' ? internalEvolutions : externalEvolutions}/>
                        : <p className="text-center text-gray-500 mt-4">Nenhuma evolução encontrada.</p>
                    }
                </div>
            </div>
        )}
        {activeTab === 'chatInternal' && (
            <ChatWindow 
                messages={internalChatMessages} 
                onSendMessage={() => handleSendMessage(true)}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                user={user}
                patient={patient}
            />
        )}
        {activeTab === 'chatExternal' && (
             <ChatWindow 
                messages={externalChatMessages} 
                onSendMessage={() => handleSendMessage(false)}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                user={user}
                patient={patient}
            />
        )}
         {activeTab === 'documents' && (
            <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Documentos e Protocolos</h2>
                    <button className="flex items-center px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600">
                        <UploadIcon />
                        <span className="ml-2">Novo Documento</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Arquivo</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Upload</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviado por</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {patientDocuments.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">{doc.fileName}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-500">{doc.uploadDate.toLocaleDateString('pt-BR')}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-500">{getTherapistName(doc.uploadedBy)}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                        <a href="#" className="text-green-600 hover:text-green-900">Ver</a>
                                        <a href="#" className="ml-4 text-red-600 hover:text-red-900">Excluir</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {patientDocuments.length === 0 && <p className="text-center text-gray-500 mt-4">Nenhum documento encontrado.</p>}
            </div>
         )}
      </div>
    </div>
  );
};

export default PatientDetailView;
