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
  if (error instanceof Error && error.message) return error.message;
  return 'Não foi possível concluir a autenticação. Tente novamente.';
};

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
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { name: name.trim() }
          }
        });
        if (error) return { error: error.message };
        return { needsEmailConfirmation: !data.session };
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    signIn: async (email, password) => {
      if (!supabase) return { error: supabaseConfigurationError ?? 'Supabase ainda não está configurado no ambiente.' };
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return error ? { error: error.message } : {};
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    signOut: async () => {
      if (!supabase) return {};
      try {
        const { error } = await supabase.auth.signOut();
        return error ? { error: error.message } : {};
      } catch (error) {
        return { error: authErrorMessage(error) };
      }
    },
    resetPassword: async (email) => {
      if (!supabase) return { error: supabaseConfigurationError ?? 'Supabase ainda não está configurado no ambiente.' };
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/`
        });
        return error ? { error: error.message } : {};
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
