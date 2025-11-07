import { supabase } from './lib/supabaseClient'
import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import type { User, Patient, ClinicSettings } from './types';
import { MOCK_USERS, MOCK_PATIENTS } from './constants';
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

// Context for global clinic settings
interface ClinicContextType {
    settings: ClinicSettings;
    setSettings: React.Dispatch<React.SetStateAction<ClinicSettings>>;
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


supabase
  .from('usuarios')
  .select('*')
  .then(({ data, error }) => {
    if (error) {
      console.log('Erro na conexão:', error.message)
    } else {
      console.log('Conectou ao Supabase ✅', data)
    }
  })

  const [settings, setSettings] = useState<ClinicSettings>({
    name: 'TeraClinic',
    logoUrl: null,
    therapistQuota: 2,
    adminQuota: 1,
  });

  const handleLogin = useCallback((email: string, pass: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setView({ name: 'dashboard' });
      return true;
    }
    return false;
  }, []);
  
  const handleSignUp = useCallback(() => {
    // In a real app, you would save the new user and then log them in.
    // Here we'll just redirect to the dashboard as a mock success.
    const masterUser = MOCK_USERS.find(u => u.role === 'MASTER');
    if(masterUser) {
        setCurrentUser(masterUser);
        setView({ name: 'dashboard' });
    } else {
        // Fallback if no master user is mocked
        setView({ name: 'login' });
    }
  }, []);

  const handlePatientLogin = useCallback((cpf: string, dob: string) => {
    const patient = MOCK_PATIENTS.find(p => p.cpf === cpf && p.dateOfBirth === dob);
    if (patient) {
      setView({ name: 'patientPortal', patient: patient });
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ name: 'login' });
  }, []);
  
  const renderContent = useMemo(() => {
    switch (view.name) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })} onSwitchToSignUp={() => setView({ name: 'signUp' })} />;
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
        return <LoginScreen onLogin={handleLogin} onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })} onSwitchToSignUp={() => setView({ name: 'signUp' })} />;
    }
  }, [view, currentUser, handleLogin, handleSignUp, handlePatientLogin, handleLogout]);

  return (
    <ClinicContext.Provider value={{ settings, setSettings }}>
        <div className="min-h-screen font-sans text-gray-800">
            {renderContent}
        </div>
    </ClinicContext.Provider>
  );
};

export default App;