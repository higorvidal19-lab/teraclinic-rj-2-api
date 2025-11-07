import React, { useState, useMemo } from 'react';
import type { User, Appointment } from '../types';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_USERS } from '../constants';
import { UserRole } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons/Icons';

interface AgendaViewProps {
  user: User;
}

const AgendaView: React.FC<AgendaViewProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const therapists = MOCK_USERS.filter(u => u.role === UserRole.THERAPIST);

  const filteredAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter(app => {
      const therapistMatch = selectedTherapist === 'all' || app.therapistId === selectedTherapist;
      const userMatch = user.role !== UserRole.THERAPIST || app.therapistId === user.id;
      return therapistMatch && userMatch;
    });
  }, [selectedTherapist, user]);

  const getPatientName = (patientId: string) => MOCK_PATIENTS.find(p => p.id === patientId)?.name || 'Desconhecido';
  const getTherapistName = (therapistId: string) => MOCK_USERS.find(u => u.id === therapistId)?.name || 'Desconhecido';
  
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatTimeForInput = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
  const placeholders = Array.from({ length: startDay });

  const appointmentsForSelectedDay = useMemo(() => {
    return filteredAppointments
      .filter(app => app.start.toDateString() === selectedDay.toDateString())
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [filteredAppointments, selectedDay]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, number>();
    filteredAppointments.forEach(app => {
        const dateStr = app.start.toDateString();
        map.set(dateStr, (map.get(dateStr) || 0) + 1);
    });
    return map;
  }, [filteredAppointments]);

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const AppointmentModal: React.FC<{ appointment?: Appointment | null, onClose: () => void }> = ({ appointment, onClose }) => {
    const isEditing = !!appointment;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Paciente</label>
                        <select defaultValue={appointment?.patientId} className="w-full p-2 bg-white border border-gray-300 rounded">
                            {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Data</label>
                            <input type="date" className="w-full p-2 bg-white border border-gray-300 rounded" defaultValue={appointment?.start.toISOString().split('T')[0] || selectedDay.toISOString().split('T')[0]} />
                        </div>
                        <div>
                            <label className="block text-gray-700">Horário</label>
                            <input type="time" step="300" className="w-full p-2 bg-white border border-gray-300 rounded" defaultValue={appointment ? formatTimeForInput(appointment.start) : ''} />
                        </div>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700">Terapeuta</label>
                        <select defaultValue={appointment?.therapistId} className="w-full p-2 bg-white border border-gray-300 rounded">
                            {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tipo de Terapia</label>
                         <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded" defaultValue={appointment?.title} placeholder="Ex: Sessão T.O."/>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" onClick={(e) => { e.preventDefault(); alert('Agendamento salvo!'); onClose(); }} className="px-4 py-2 text-white bg-green-500 rounded-md">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };


  return (
    <div>
      {isModalOpen && <AppointmentModal onClose={() => setIsModalOpen(false)} />}
      {isEditModalOpen && <AppointmentModal appointment={editingAppointment} onClose={() => setIsEditModalOpen(false)} />}
      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
          <p className="mt-1 text-gray-600">Visualize e gerencie seus agendamentos.</p>
        </div>
        <div className="flex items-center mt-4 space-x-4 md:mt-0">
            {user.role !== UserRole.THERAPIST && (
                <select value={selectedTherapist} onChange={e => setSelectedTherapist(e.target.value)} className="p-2 bg-white border border-gray-300 rounded-md">
                    <option value="all">Todos Terapeutas</option>
                    {therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            )}
            <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
                <PlusIcon /> <span className="hidden ml-2 sm:inline">Novo Agendamento</span>
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-md lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon /></button>
                <h2 className="text-xl font-semibold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-bold border-b">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {placeholders.map((_, i) => <div key={`ph-${i}`} className="h-24 border-r border-b"></div>)}
                {days.map(day => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = day.toDateString() === selectedDay.toDateString();
                    const hasAppointments = appointmentsByDate.has(day.toDateString());
                    return (
                        <div key={day.toString()} onClick={() => setSelectedDay(day)} className={`h-24 p-2 border-r border-b cursor-pointer transition-colors ${isSelected ? 'bg-green-200' : 'hover:bg-green-50'}`}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-green-500 text-white' : ''} ${isSelected ? 'ring-2 ring-green-600' : ''}`}>
                                {day.getDate()}
                            </div>
                            {hasAppointments && <div className="flex justify-center mt-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>}
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Agenda para {selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {appointmentsForSelectedDay.length > 0 ? (
                    appointmentsForSelectedDay.map(app => (
                        <div key={app.id} onClick={() => handleEditClick(app)} className="p-3 transition-colors bg-green-100 border-l-4 border-green-500 rounded-lg cursor-pointer hover:bg-green-200">
                            <p className="font-bold text-green-800">{app.title}</p>
                            <p className="text-sm text-gray-700">{getPatientName(app.patientId)}</p>
                            <p className="text-sm text-gray-600">{formatTime(app.start)} - {formatTime(app.end)}</p>
                             {user.role !== UserRole.THERAPIST && <p className="mt-1 text-xs text-gray-500">Terapeuta: {getTherapistName(app.therapistId)}</p>}
                        </div>
                    ))
                ) : (
                    <p className="mt-8 text-center text-gray-500">Nenhum agendamento para este dia.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaView;