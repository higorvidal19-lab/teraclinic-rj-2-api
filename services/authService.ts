import { supabase } from '../lib/supabaseClient';

export async function signUpUser(email: string, password: string, nome: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, role: 'master' },
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Usuário não retornado após o signup.');

  // 🔹 Não precisa mais inserir manualmente em "profiles"
  // A trigger no Supabase fará isso automaticamente.

  return data;
}
