import { supabase } from '../lib/supabaseClient';

export async function signUpUser(email: string, password: string, nome: string) {
  // Cria o usuário no Supabase Auth com metadados
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, role: 'master' }, // metadados do usuário
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Usuário não retornado após o signup.');

  // Salva o perfil na tabela "profiles"
  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    email,
    nome,
    role: 'master',
    created_at: new Date().toISOString(),
  });

  if (insertError) throw insertError;

  return data;
}
