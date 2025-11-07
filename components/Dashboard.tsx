import React, { useState } from 'react';
import type { User, Patient } from '../types';
import { UserRole } from '../types';
import { CalendarIcon, UsersIcon, FileTextIcon, DollarSignIcon, LogoutIcon, SettingsIcon, CreditCardIcon } from './icons/Icons';
import AgendaView from './AgendaView';
import PatientsView from './PatientsView';
import PatientDetailView from './PatientDetailView';
import FinancialView from './FinancialView';
import UsersView from './UsersView';
import SettingsView from './SettingsView';
import AccountManagementView from './AccountManagementView';
import { useClinic } from '../App';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type Section = 'agenda' | 'pacientes' | 'financeiro' | 'usuarios' | 'configuracoes' | 'gestaoDeConta';
type PatientViewMode = { name: 'list' } | { name: 'detail', patient: Patient };

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState<Section>('agenda');
  const [patientView, setPatientView] = useState<PatientViewMode>({ name: 'list' });
  const { settings } = useClinic();

  const renderSection = () => {
    switch (activeSection) {
      case 'agenda':
        return <AgendaView user={user} />;
      case 'pacientes':
        if(patientView.name === 'list') {
            return <PatientsView onSelectPatient={(patient) => setPatientView({name: 'detail', patient})} />;
        } else {
            return <PatientDetailView patient={patientView.patient} user={user} onBack={() => setPatientView({name: 'list'})} />;
        }
      case 'financeiro':
        return <FinancialView />;
      case 'usuarios':
        return <UsersView currentUser={user} />;
      case 'configuracoes':
        return <SettingsView />;
      case 'gestaoDeConta':
        return <AccountManagementView />;
      default:
        return <AgendaView user={user} />;
    }
  };
  
  const NavItem: React.FC<{ section: Section; label: string; icon: React.ReactNode }> = ({ section, label, icon }) => (
    <li
        onClick={() => {
            setActiveSection(section);
            if (section === 'pacientes') setPatientView({ name: 'list' });
        }}
        className={`flex items-center px-4 py-3 text-gray-700 rounded-lg cursor-pointer transition-colors ${
        activeSection === section ? 'bg-green-200 text-green-800 font-bold' : 'hover:bg-green-100'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-20 px-4 border-b">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Clinic Logo" className="h-12 max-w-full"/>
          ) : (
            <h1 className="text-2xl font-bold text-green-600 truncate">{settings.name}</h1>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <ul>
            <NavItem section="agenda" label="Agenda" icon={<CalendarIcon />} />
            <NavItem section="pacientes" label="Pacientes" icon={<FileTextIcon />} />
            {user.role !== UserRole.THERAPIST && <NavItem section="financeiro" label="Financeiro" icon={<DollarSignIcon />} />}
            {user.role === UserRole.MASTER && <NavItem section="usuarios" label="Usuários" icon={<UsersIcon />} />}
          </ul>
        </nav>
        <div className="p-4 border-t">
            {user.role === UserRole.MASTER && (
                <div className="mb-2 space-y-2">
                  <NavItem section="gestaoDeConta" label="Gestão de Conta" icon={<CreditCardIcon />} />
                  <NavItem section="configuracoes" label="Configurações" icon={<SettingsIcon />} />
                </div>
            )}
            <div className="flex items-center pt-2 border-t">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full"/>
                <div className="ml-3">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
                <LogoutIcon />
                Sair
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container px-6 py-8 mx-auto">
            {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;