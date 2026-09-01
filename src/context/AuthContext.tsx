import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigurationError, supabaseConfigured } from '../lib/supabase';

type AuthResult = { error?: string; needsEmailConfirmation?: boolean };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  configurationError: string | null;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authErrorMessage = (error: unknown) => {
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return 'Não foi possível conectar ao Supabase. Verifique sua internet e tente novamente.';
  }

  const message = error instanceof Error ? error.message : '';
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  const normalizedMessage = message.toLowerCase();

  if (code === 'invalid_credentials' || normalizedMessage.includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos. Se ainda não criou sua conta, escolha “Criar conta”.';
  }
  if (code === 'email_not_confirmed' || normalizedMessage.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada antes de entrar.';
  }
  if (code === 'user_already_exists' || normalizedMessage.includes('user already registered')) {
    return 'Já existe uma conta com este e-mail. Entre com sua senha ou recupere o acesso.';
  }
  if (code === 'over_email_send_rate_limit' || normalizedMessage.includes('email rate limit exceeded')) {
    return 'O serviço de e-mail atingiu o limite temporário. Aguarde um pouco e tente novamente.';
  }
  if (code === 'weak_password' || normalizedMessage.includes('password should be')) {
    return 'Escolha uma senha mais forte, com pelo menos 6 caracteres.';
  }
  if (code === 'email_address_invalid' || normalizedMessage.includes('email address') && normalizedMessage.includes('invalid')) {
    return 'Informe um endereço de e-mail válido.';
  }
  if (code === 'signup_disabled' || normalizedMessage.includes('signups not allowed')) {
    return 'A criação de novas contas está temporariamente indisponível.';
  }
  if (code === 'over_request_rate_limit' || normalizedMessage.includes('too many requests')) {
    return 'Muitas tentativas foram feitas. Aguarde alguns minutos e tente novamente.';
  }

  if (message) return message;
  return 'Não foi possível concluir a autenticação. Tente novamente.';
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.error('[auth] Falha ao restaurar a sessão:', error.message);
        setSession(data.session);
      })
      .catch((error: unknown) => {
        if (mounted) console.error('[auth] Falha inesperada ao restaurar a sessão:', authErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    configured: supabaseConfigured,
    configurationError: supabaseConfigurationError,
    signUp: async (name, email, password) => {
      if (!supabase) return { error: supabaseConfigurationError ?? 'Supabase ainda não está configurado no ambiente.' };
      try {
        const redirectTo = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email: normalizeEmail(email),
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { name: name.trim() }
          }
        });
        if (error) return { error: authErrorMessage(error) };
        return { needsEmailConfirmation: !data.session };
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    signIn: async (email, password) => {
      if (!supabase) return { error: supabaseConfigurationError ?? 'Supabase ainda não está configurado no ambiente.' };
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
        return error ? { error: authErrorMessage(error) } : {};
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    signOut: async () => {
      if (!supabase) return {};
      try {
        const { error } = await supabase.auth.signOut();
        return error ? { error: authErrorMessage(error) } : {};
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    resetPassword: async (email) => {
      if (!supabase) return { error: supabaseConfigurationError ?? 'Supabase ainda não está configurado no ambiente.' };
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
          redirectTo: `${window.location.origin}/`
        });
        return error ? { error: authErrorMessage(error) } : {};
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    }
  }), [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
