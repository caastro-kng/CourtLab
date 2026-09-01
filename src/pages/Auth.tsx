import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register' | 'forgot';

export const Auth: React.FC = () => {
  const { signIn, signUp, resetPassword, configured, configurationError } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await (mode === 'register'
      ? signUp(name, email, password)
      : mode === 'forgot'
        ? resetPassword(email)
        : signIn(email, password));

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'register' && result.needsEmailConfirmation) {
      setMessage('Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar.');
      setMode('login');
      setPassword('');
    } else if (mode === 'forgot') {
      setMessage('Enviamos um link de recuperação para seu e-mail.');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-white grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden lg:flex relative overflow-hidden border-r border-white/[0.06] p-12 xl:p-16 flex-col justify-between">
        <div className="absolute inset-0 bg-court-pattern opacity-60" />
        <div className="absolute -right-20 top-24 w-80 h-80 rounded-full bg-[#FF6B1A]/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/court-lab-mark.svg" alt="" className="w-12 h-12 rounded-2xl border border-[#FF6B1A]/30" />
            <span className="font-heading text-2xl">COURT <span className="text-[#FF6B1A]">LAB</span></span>
          </div>
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="cl-kicker text-[#FF8D4D]">Personal Basketball Development</span>
          <h1 className="cl-hero-title mt-4 max-w-lg">TREINE. EVOLUA. LEVE PARA O JOGO.</h1>
          <p className="cl-body-copy mt-5 max-w-lg">Seu plano, seus drills e sua evolução agora ficam ligados à sua própria conta CourtLab.</p>
          <div className="mt-10 grid grid-cols-3 border-y border-white/[0.07] divide-x divide-white/[0.07]">
            {['Treino pessoal','Progresso salvo','Plano individual'].map((item) => <div key={item} className="py-4 px-3 first:pl-0 cl-label text-[#9AA1AA]">{item}</div>)}
          </div>
        </div>
      </section>

      <main className="min-h-screen flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <img src="/court-lab-mark.svg" alt="" className="w-10 h-10 rounded-xl border border-[#FF6B1A]/30" />
            <span className="font-heading text-xl">COURT <span className="text-[#FF6B1A]">LAB</span></span>
          </div>

          <span className="cl-kicker text-[#FF6B1A]">Acesso do atleta</span>
          <h2 className="cl-page-title mt-2">
            {mode === 'register' ? 'CRIAR CONTA' : mode === 'forgot' ? 'RECUPERAR ACESSO' : 'ENTRAR NO COURTLAB'}
          </h2>
          <p className="cl-body-copy mt-3">
            {mode === 'register' ? 'Crie sua identidade de atleta e mantenha sua evolução vinculada à sua conta.' : mode === 'forgot' ? 'Informe seu e-mail para receber o link de recuperação.' : 'Continue de onde parou e volte para a quadra.'}
          </p>

          {!configured && <div className="mt-6 p-4 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] text-sm text-amber-200">{configurationError ?? 'As variáveis do Supabase ainda não estão disponíveis neste ambiente.'}</div>}
          {message && <div className="mt-6 p-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] text-sm text-emerald-300">{message}</div>}
          {error && <div className="mt-6 p-4 rounded-2xl border border-red-400/25 bg-red-400/[0.06] text-sm text-red-300">{error}</div>}

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === 'register' && <label className="block"><span className="cl-label text-[#8F98A4]">Nome</span><div className="mt-2 relative"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697481]" /><input required value={name} onChange={(e)=>setName(e.target.value)} className="w-full h-12 rounded-xl bg-[#11161C] border border-white/[0.08] pl-10 pr-4 text-sm text-white outline-none focus:border-[#FF6B1A]" placeholder="Seu nome" /></div></label>}
            <label className="block"><span className="cl-label text-[#8F98A4]">E-mail</span><div className="mt-2 relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697481]" /><input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full h-12 rounded-xl bg-[#11161C] border border-white/[0.08] pl-10 pr-4 text-sm text-white outline-none focus:border-[#FF6B1A]" placeholder="voce@email.com" /></div></label>
            {mode !== 'forgot' && <label className="block"><span className="cl-label text-[#8F98A4]">Senha</span><div className="mt-2 relative"><LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697481]" /><input required minLength={6} type={showPassword?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full h-12 rounded-xl bg-[#11161C] border border-white/[0.08] pl-10 pr-11 text-sm text-white outline-none focus:border-[#FF6B1A]" placeholder="Mínimo de 6 caracteres" /><button type="button" onClick={()=>setShowPassword((v)=>!v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#697481] hover:text-white" aria-label="Mostrar ou ocultar senha">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></label>}

            {mode === 'login' && <div className="flex justify-end"><button type="button" onClick={()=>changeMode('forgot')} className="text-xs font-semibold text-[#FF8D4D]">Esqueci minha senha</button></div>}

            <button disabled={loading || !configured} className="w-full min-h-12 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] disabled:opacity-50 disabled:cursor-not-allowed cl-button-text text-white flex items-center justify-center gap-2">
              {loading ? 'Processando...' : mode === 'register' ? 'Criar minha conta' : mode === 'forgot' ? 'Enviar recuperação' : 'Entrar'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.07] text-center text-sm text-[#8F98A4]">
            {mode === 'register' ? <>Já possui conta? <button onClick={()=>changeMode('login')} className="font-bold text-white">Entrar</button></> : mode === 'forgot' ? <button onClick={()=>changeMode('login')} className="font-bold text-white">Voltar para entrar</button> : <>Ainda não tem conta? <button onClick={()=>changeMode('register')} className="font-bold text-white">Criar conta</button></>}
          </div>
        </div>
      </main>
    </div>
  );
};
