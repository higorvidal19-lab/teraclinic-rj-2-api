import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import type { User, Patient, ClinicSettings, Appointment, Evolution, ChatMessage, FinancialRecord, Document } from './types';
import { UserRole, Permission } from './types';
import { MOCK_USERS, MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_EVOLUTIONS, MOCK_CHAT_MESSAGES, MOCK_FINANCIALS, MOCK_DOCUMENTS } from './constants';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import PatientLoginScreen from './components/PatientLoginScreen';
import Dashboard from './components/Dashboard';
import PatientPortal from './components/PatientPortal';

type View = 
  | { name: 'login' }
  | { name: 'signUp' }
  | { name: 'patientLogin' }
  | { name: 'dashboard' }
  | { name: 'patientPortal', patient: Patient };

// Context for global clinic settings and data
interface ClinicContextType {
    settings: ClinicSettings;
    setSettings: React.Dispatch<React.SetStateAction<ClinicSettings>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
    appointments: Appointment[];
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    evolutions: Evolution[];
    setEvolutions: React.Dispatch<React.SetStateAction<Evolution[]>>;
    chatMessages: ChatMessage[];
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    financials: FinancialRecord[];
    setFinancials: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
    documents: Document[];
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
    currentUser: User | null;
}
const ClinicContext = createContext<ClinicContextType | undefined>(undefined);
export const useClinic = () => {
    const context = useContext(ClinicContext);
    if (!context) {
        throw new Error('useClinic must be used within a ClinicProvider');
    }
    return context;
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ name: 'login' });
  
  // App-wide state management
  const [settings, setSettings] = useState<ClinicSettings>({
    name: 'TeraClinic',
    logoUrl: null,
    therapistQuota: 2,
    adminQuota: 1,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleLogin = useCallback((email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setView({ name: 'dashboard' });
      return true;
    }
    return false;
  }, [users]);
  
  const handleSignUp = useCallback((formData: any) => {
    const newUser: User = {
        id: `user-master-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        dateOfBirth: formData.dateOfBirth,
        role: UserRole.MASTER,
        permissions: [Permission.FINANCIAL_CONTROL, Permission.MANAGE_THERAPISTS, Permission.MANAGE_SCHEDULE],
        avatarUrl: null,
    };
    
    setUsers(prev => [...prev, newUser]);
    setSettings(prev => ({ ...prev, name: formData.companyName }));
    setCurrentUser(newUser);
    setView({ name: 'dashboard' });
  }, []);

  const handlePatientLogin = useCallback((cpf: string, dob: string) => {
    const patient = patients.find(p => p.cpf === cpf && p.dateOfBirth === dob);
    if (patient) {
      setView({ name: 'patientPortal', patient: patient });
      return true;
    }
    return false;
  }, [patients]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ name: 'login' });
  }, []);

  const handleForgotPassword = useCallback((cpf: string, dob: string, email: string): boolean => {
    const user = users.find(u => u.cpf === cpf && u.dateOfBirth === dob && u.email === email);
    return !!user;
  }, [users]);
  
  const contextValue = useMemo(() => ({
    settings, setSettings,
    users, setUsers,
    patients, setPatients,
    appointments, setAppointments,
    evolutions, setEvolutions,
    chatMessages, setChatMessages,
    financials, setFinancials,
    documents, setDocuments,
    currentUser
  }), [settings, users, patients, appointments, evolutions, chatMessages, financials, documents, currentUser]);

  const renderContent = useMemo(() => {
    switch (view.name) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })} onSwitchToSignUp={() => setView({ name: 'signUp' })} onForgotPassword={handleForgotPassword} />;
      case 'signUp':
        return <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={() => setView({ name: 'login' })} />;
      case 'patientLogin':
        return <PatientLoginScreen onPatientLogin={handlePatientLogin} onSwitchToAdminLogin={() => setView({ name: 'login' })} />;
      case 'dashboard':
        if (currentUser) {
          return <Dashboard user={currentUser} onLogout={handleLogout} />;
        }
        setView({ name: 'login' });
        return null;
      case 'patientPortal':
        return <PatientPortal patient={view.patient} onLogout={() => setView({ name: 'patientLogin' })} />;
      default:
        return <LoginScreen onLogin={handleLogin} onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })} onSwitchToSignUp={() => setView({ name: 'signUp' })} onForgotPassword={handleForgotPassword} />;
    }
  }, [view, currentUser, handleLogin, handleSignUp, handlePatientLogin, handleLogout, handleForgotPassword]);

  return (
    <ClinicContext.Provider value={contextValue}>
        <div className="min-h-screen font-sans text-gray-800">
            {renderContent}
        </div>
    </ClinicContext.Provider>
  );
};

export default App;