// src/services/authService.ts

import { supabase } from '../lib/supabaseClient';

/**
 * Faz o cadastro de um novo usuário no Supabase.
 * Cria automaticamente um registro na tabela "profiles"
 * via trigger configurada no banco.
 */
export async function signUpUser(email: string, password: string, nome: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, role: 'master' }, // Dados extras armazenados em user_metadata
    },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Usuário não retornado após o signup.');

  return data;
}

/**
 * Faz login com email e senha
 */
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

/**
 * Faz logout do usuário atual
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Retorna o usuário atualmente autenticado (se existir)
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
