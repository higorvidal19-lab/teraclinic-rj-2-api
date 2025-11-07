import { supabase } from './lib/supabaseClient';
import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';
import type { User, Patient, ClinicSettings } from './types';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import PatientLoginScreen from './components/PatientLoginScreen';
import Dashboard from './components/Dashboard';
import PatientPortal from './components/PatientPortal';

// 🔹 Importa o authService centralizado
import { signInUser, signOutUser, getCurrentUser } from './services/authService';

// Tipagem de views (telas)
type View =
  | { name: 'login' }
  | { name: 'signUp' }
  | { name: 'patientLogin' }
  | { name: 'dashboard' }
  | { name: 'patientPortal'; patient: Patient };

// Contexto global da clínica
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

  // 🔹 LOGIN REAL COM SUPABASE (via authService)
  const handleLogin = useCallback(async (email: string, pass: string) => {
    try {
      console.log('Tentando login:', email);

      const { user } = await signInUser(email, pass);
      if (!user) {
        console.warn('Usuário não encontrado.');
        return false;
      }

      // 🔸 Busca o perfil correspondente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError.message);
        return false;
      }

      console.log('Perfil carregado:', profile);

      // 🔸 Define o usuário atual com role correta
      setCurrentUser({
        id: user.id,
        email: user.email ?? '',
        name: profile?.nome ?? 'Usuário',
        role: profile?.role ?? 'user',
      });

      // Se for MASTER, libera todas as funções do dashboard
      if (profile?.role === 'master' || profile?.role === 'MASTER') {
        console.log('Usuário MASTER logado ✅');
      } else {
        console.warn('Usuário comum logado, acesso limitado.');
      }

      setView({ name: 'dashboard' });
      return true;
    } catch (err: any) {
      console.error('Erro ao logar:', err.message);
      return false;
    }
  }, []);

  // 🔹 LOGOUT REAL
  const handleLogout = useCallback(async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setView({ name: 'login' });
    } catch (err: any) {
      console.error('Erro ao deslogar:', err.message);
    }
  }, []);

  // 🔹 LOGIN DE PACIENTE (mockado)
  const handlePatientLogin = useCallback((cpf: string, dob: string) => {
    if (cpf === '00000000000' && dob === '2000-01-01') {
      setView({
        name: 'patientPortal',
        patient: { cpf, name: 'Paciente Teste', dateOfBirth: dob },
      });
      return true;
    }
    return false;
  }, []);

  // 🔹 SIGNUP MOCK (a tela real de cadastro já faz o signup via Supabase)
  const handleSignUp = useCallback(() => {
    setView({ name: 'login' });
  }, []);

  // 🔹 Mantém o usuário logado após recarregar
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          setCurrentUser({
            id: user.id,
            email: user.email ?? '',
            name: profile?.nome ?? 'Usuário',
            role: profile?.role ?? 'user',
          });
          setView({ name: 'dashboard' });
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      }
    })();
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
