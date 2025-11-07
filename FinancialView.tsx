import React, { useState, useMemo } from 'react';
import { useClinic } from '../App';
import { PlusIcon } from './icons/Icons';
import type { FinancialRecord } from '../types';

const FinancialView: React.FC = () => {
  const { financials, setFinancials, patients } = useClinic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRecords = useMemo(() => {
    return financials.filter(record => {
      if (!startDate && !endDate) return true;
      const recordDate = record.date.getTime();
      const startDateTime = startDate ? new Date(startDate).getTime() : 0;
      const endDateTime = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
      return recordDate >= startDateTime && recordDate <= endDateTime;
    }).sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [startDate, endDate, financials]);

  const getPatientName = (patientId: string) => {
    if (!patientId) return 'N/A';
    return patients.find(p => p.id === patientId)?.name || 'Desconhecido';
  };

  const totalIncome = filteredRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = filteredRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
  const balance = totalIncome + totalExpense; // expense is negative

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleRowClick = (record: FinancialRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const TransactionDetailModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Detalhes da Transação</h2>
            {selectedRecord && (
                 <div className="space-y-3">
                    <p><strong>Descrição:</strong> {selectedRecord.description}</p>
                    <p><strong>Valor:</strong> <span className={selectedRecord.type === 'income' ? 'text-green-600' : 'text-red-600'}>{formatCurrency(selectedRecord.amount)}</span></p>
                    <p><strong>Data:</strong> {selectedRecord.date.toLocaleString('pt-BR')}</p>
                    <p><strong>Paciente:</strong> {getPatientName(selectedRecord.patientId)}</p>
                    <p><strong>Tipo:</strong> {selectedRecord.type === 'income' ? 'Receita' : 'Despesa'}</p>
                 </div>
            )}
            <div className="flex justify-end mt-6">
                <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Fechar</button>
            </div>
        </div>
    </div>
  );

  const NewEntryModal = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const amount = parseFloat(formData.get('amount') as string);
        
        const newRecord: FinancialRecord = {
            id: `fin-${Date.now()}`,
            patientId: formData.get('patientId') as string,
            description: formData.get('description') as string,
            amount: amount,
            date: new Date(formData.get('date') as string),
            type: amount >= 0 ? 'income' : 'expense',
        };
        
        setFinancials(prev => [...prev, newRecord]);
        alert('Lançamento salvo!');
        setIsModalOpen(false);
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Novo Lançamento</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Descrição</label>
                        <input name="description" type="text" required className="w-full p-2 bg-white border border-gray-300 rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Valor (R$)</label>
                        <input name="amount" type="number" step="0.01" required placeholder="Use negativo para despesas (ex: -50.00)" className="w-full p-2 bg-white border border-gray-300 rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Data</label>
                        <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2 bg-white border border-gray-300 rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Paciente (Opcional)</label>
                        <select name="patientId" className="w-full p-2 bg-white border border-gray-300 rounded">
                            <option value="">Nenhum</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div>
        {isModalOpen && <NewEntryModal />}
        {isDetailModalOpen && <TransactionDetailModal />}
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row no-print">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
                <p className="mt-1 text-gray-600">Controle suas receitas e despesas.</p>
            </div>
            <div className="flex items-center mt-4 space-x-2 md:mt-0">
                <button onClick={() => window.print()} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300">Imprimir Histórico</button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
                    <PlusIcon /> <span className="hidden ml-2 sm:inline">Novo Lançamento</span>
                </button>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3 no-print">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-gray-500">Receita no Período</h3>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-gray-500">Despesa no Período</h3>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(Math.abs(totalExpense))}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-gray-500">Saldo no Período</h3>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>{formatCurrency(balance)}</p>
            </div>
        </div>

        {/* Transaction Table */}
        <div className="p-4 bg-white rounded-lg shadow-md printable-area">
            <h2 className="text-xl font-bold mb-4">Histórico de Transações</h2>
             <div className="flex flex-wrap items-center gap-4 mb-4 no-print">
                <div>
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700">De:</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 ml-2 bg-white border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700">Até:</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 ml-2 bg-white border border-gray-300 rounded-md"/>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRecords.map(record => (
                            <tr key={record.id} onClick={() => handleRowClick(record)} className="cursor-pointer hover:bg-gray-50">
                                <td className="py-4 px-6 whitespace-nowrap text-gray-500">{record.date.toLocaleDateString('pt-BR')}</td>
                                <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">{record.description}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-500">{getPatientName(record.patientId)}</td>
                                <td className={`py-4 px-6 whitespace-nowrap font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {record.type === 'income' ? '+' : ''}{formatCurrency(record.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredRecords.length === 0 && <p className="mt-4 text-center text-gray-500">Nenhuma transação encontrada. Cadastre uma nova ou ajuste o período do filtro.</p>}
            </div>
        </div>
    </div>
  );
};

export default FinancialView;