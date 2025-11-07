import { supabase } from './lib/supabaseClient';
import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';
import type { User, Patient, ClinicSettings } from './types';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import PatientLoginScreen from './components/PatientLoginScreen';
import Dashboard from './components/Dashboard';
import PatientPortal from './components/PatientPortal';

// Tipagem de views (telas)
type View =
  | { name: 'login' }
  | { name: 'signUp' }
  | { name: 'patientLogin' }
  | { name: 'dashboard' }
  | { name: 'patientPortal'; patient: Patient };

// Contexto global para configurações da clínica
interface ClinicContextType {
  settings: ClinicSettings;
  setSettings: React.Dispatch<React.SetStateAction<ClinicSettings>>;
}
const ClinicContext = createContext<ClinicContextType | undefined>(undefined);
export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic deve ser usado dentro de um ClinicProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ name: 'login' });

  const [settings, setSettings] = useState<ClinicSettings>({
    name: 'TeraClinic',
    logoUrl: null,
    therapistQuota: 2,
    adminQuota: 1,
  });

  // 🔹 LOGIN REAL COM SUPABASE
  const handleLogin = useCallback(async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        console.error('Erro ao logar:', error.message);
        return false;
      }

      if (!data.user) {
        console.warn('Usuário não retornado.');
        return false;
      }

      // Busca o perfil na tabela "profiles"
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError.message);
        return false;
      }

      // Define o usuário atual
      setCurrentUser({
        id: data.user.id,
        email: data.user.email ?? '',
        name: profile?.nome ?? 'Usuário',
        role: profile?.role ?? 'user',
      });

      setView({ name: 'dashboard' });
      return true;
    } catch (err) {
      console.error('Erro inesperado no login:', err);
      return false;
    }
  }, []);

  // 🔹 SIGNUP MOCK (a tela real de cadastro já faz o signup via Supabase)
  const handleSignUp = useCallback(() => {
    setView({ name: 'login' });
  }, []);

  // 🔹 LOGIN DE PACIENTE (mockado por enquanto)
  const handlePatientLogin = useCallback((cpf: string, dob: string) => {
    // Exemplo simples: valida login local (pode ser ligado ao Supabase depois)
    if (cpf === '00000000000' && dob === '2000-01-01') {
      setView({
        name: 'patientPortal',
        patient: { cpf, name: 'Paciente Teste', dateOfBirth: dob },
      });
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ name: 'login' });
  }, []);

  // 🔹 Mantém o usuário logado após recarregar a página
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const user = data.session.user;
        setCurrentUser({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.nome ?? 'Usuário',
          role: user.user_metadata?.role ?? 'user',
        });
        setView({ name: 'dashboard' });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.nome ?? 'Usuário',
          role: session.user.user_metadata?.role ?? 'user',
        });
        setView({ name: 'dashboard' });
      } else {
        setCurrentUser(null);
        setView({ name: 'login' });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Renderização condicional das telas
  const renderContent = useMemo(() => {
    switch (view.name) {
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })}
            onSwitchToSignUp={() => setView({ name: 'signUp' })}
          />
        );
      case 'signUp':
        return <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={() => setView({ name: 'login' })} />;
      case 'patientLogin':
        return (
          <PatientLoginScreen
            onPatientLogin={handlePatientLogin}
            onSwitchToAdminLogin={() => setView({ name: 'login' })}
          />
        );
      case 'dashboard':
        if (currentUser) {
          return <Dashboard user={currentUser} onLogout={handleLogout} />;
        }
        setView({ name: 'login' });
        return null;
      case 'patientPortal':
        return <PatientPortal patient={view.patient} onLogout={() => setView({ name: 'patientLogin' })} />;
      default:
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSwitchToPatientLogin={() => setView({ name: 'patientLogin' })}
            onSwitchToSignUp={() => setView({ name: 'signUp' })}
          />
        );
    }
  }, [view, currentUser, handleLogin, handleSignUp, handlePatientLogin, handleLogout]);

  return (
    <ClinicContext.Provider value={{ settings, setSettings }}>
      <div className="min-h-screen font-sans text-gray-800">{renderContent}</div>
    </ClinicContext.Provider>
  );
};

export default App;
