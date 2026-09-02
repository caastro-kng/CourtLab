import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Crosshair,
  Dumbbell,
  Gauge,
  Hand,
  LogOut,
  Shield,
  Sparkles,
  Timer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { DifficultyLevel, OnboardingAnswers, TrainingFocus } from '../types';
import { TRAINING_FOCUS } from '../utils/onboarding';

const FOCUS_OPTIONS = [
  { value: 'ball-handle', icon: Hand, description: 'Drible, mudança de ritmo e domínio das duas mãos.' },
  { value: 'shooting', icon: Crosshair, description: 'Mecânica, volume e criação do próprio arremesso.' },
  { value: 'finishing', icon: Gauge, description: 'Bandejas, floaters e repertório ao redor do aro.' },
  { value: 'passing', icon: BrainCircuit, description: 'Passe, visão de quadra e tomada de decisão.' },
  { value: 'defense', icon: Shield, description: 'Pés rápidos, contenção e defesa no perímetro.' },
  { value: 'athletic', icon: Dumbbell, description: 'Explosão, agilidade e condicionamento físico.' },
  { value: 'complete', icon: Sparkles, description: 'Uma semana equilibrada para evoluir o jogo todo.' }
] satisfies Array<{ value: TrainingFocus; icon: React.ComponentType<{ className?: string }>; description: string }>;

const LEVEL_OPTIONS: Array<{ value: DifficultyLevel; description: string }> = [
  { value: 'Iniciante', description: 'Estou construindo a base.' },
  { value: 'Intermediário', description: 'Já treino com alguma frequência.' },
  { value: 'Avançado', description: 'Treino forte e quero mais detalhe.' },
  { value: 'Competitivo', description: 'Jogo ou treino em alto nível.' }
];

const DAYS: OnboardingAnswers['trainingDaysPerWeek'][] = [2, 3, 4, 5, 6];
const DURATIONS: OnboardingAnswers['sessionDurationMinutes'][] = [30, 45, 60];

export const Onboarding: React.FC = () => {
  const { profile, completeOnboarding } = usePlayer();
  const { signOut } = useAuth();
  const [trainingFocus, setTrainingFocus] = useState<TrainingFocus | null>(null);
  const [level, setLevel] = useState<DifficultyLevel>('Iniciante');
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState<OnboardingAnswers['trainingDaysPerWeek']>(3);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<OnboardingAnswers['sessionDurationMinutes']>(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!trainingFocus) {
      setError('Escolha o foco principal do seu primeiro plano.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await completeOnboarding({
      trainingFocus,
      level,
      trainingDaysPerWeek,
      sessionDurationMinutes
    });
    setLoading(false);
    if (result.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-white bg-court-pattern">
      <header className="h-18 border-b border-white/[0.06] px-5 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/court-lab-mark.svg" alt="" className="w-10 h-10 rounded-xl border border-[#FF6B1A]/30" />
          <span className="font-heading text-xl">COURT <span className="text-[#FF6B1A]">LAB</span></span>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-2 text-xs font-bold text-[#909AA6] hover:text-white"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-16 grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-16">
        <section className="lg:sticky lg:top-10 lg:self-start">
          <span className="cl-eyebrow">Primeiro acesso</span>
          <h1 className="cl-page-title mt-4 max-w-md">SEU TREINO COMEÇA COM VOCÊ.</h1>
          <p className="cl-copy mt-5 max-w-md">
            Olá, {profile.name}. Responda três perguntas rápidas e o CourtLab montará uma semana inicial alinhada ao seu momento.
          </p>
          <div className="mt-8 py-5 border-y border-white/[0.07] grid grid-cols-3 divide-x divide-white/[0.07]">
            <div><strong className="font-mono-num text-xl">03</strong><span className="block cl-label mt-1">Perguntas</span></div>
            <div className="pl-5"><strong className="font-mono-num text-xl">07</strong><span className="block cl-label mt-1">Dias</span></div>
            <div className="pl-5"><strong className="font-mono-num text-xl">01</strong><span className="block cl-label mt-1">Plano</span></div>
          </div>
        </section>

        <form onSubmit={submit} aria-busy={loading} className="space-y-8">
          <section>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FF6B1A] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <h2 className="cl-card-title text-lg">O que você mais quer desenvolver agora?</h2>
                <p className="cl-copy-small mt-1">Escolha um foco principal. Você poderá mudar isso no perfil depois.</p>
              </div>
            </div>
            <div role="radiogroup" aria-label="Foco principal" className="grid sm:grid-cols-2 gap-3">
              {FOCUS_OPTIONS.map(({ value, icon: Icon, description }) => {
                const selected = trainingFocus === value;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    key={value}
                    onClick={() => setTrainingFocus(value)}
                    className={`min-h-28 p-4 rounded-2xl border text-left flex gap-3 transition-colors ${selected ? 'border-[#FF6B1A] bg-[#FF6B1A]/[0.08]' : 'border-white/[0.08] bg-[#11161C] hover:border-white/[0.16]'}`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-[#FF6B1A] text-white' : 'bg-white/[0.05] text-[#8F98A4]'}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span>
                      <strong className="block text-sm text-white">{TRAINING_FOCUS[value].shortLabel}</strong>
                      <span className="block text-xs leading-5 text-[#89939F] mt-1">{description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pt-7 border-t border-white/[0.07]">
            <div className="flex items-start gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FF6B1A] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <h2 className="cl-card-title text-lg">Qual é o seu nível atual?</h2>
                <p className="cl-copy-small mt-1">Isso ajusta a dificuldade dos treinos sugeridos.</p>
              </div>
            </div>
            <div role="radiogroup" aria-label="Nível atual" className="grid sm:grid-cols-2 gap-3">
              {LEVEL_OPTIONS.map((option) => {
                const selected = level === option.value;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    key={option.value}
                    onClick={() => setLevel(option.value)}
                    className={`p-4 rounded-2xl border text-left ${selected ? 'border-[#FF6B1A] bg-[#FF6B1A]/[0.08]' : 'border-white/[0.08] bg-[#11161C] hover:border-white/[0.16]'}`}
                  >
                    <strong className="block text-sm">{option.value}</strong>
                    <span className="block text-xs text-[#89939F] mt-1">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pt-7 border-t border-white/[0.07]">
            <div className="flex items-start gap-3 mb-5">
              <span className="w-7 h-7 rounded-full bg-[#FF6B1A] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <h2 className="cl-card-title text-lg">Quanto tempo cabe na sua rotina?</h2>
                <p className="cl-copy-small mt-1">Monte uma frequência realista para manter a consistência.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <span className="cl-label flex items-center gap-2"><Activity className="w-4 h-4" /> Dias por semana</span>
                <div role="radiogroup" aria-label="Dias por semana" className="mt-3 grid grid-cols-5 gap-2">
                  {DAYS.map((days) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={trainingDaysPerWeek === days}
                      key={days}
                      onClick={() => setTrainingDaysPerWeek(days)}
                      className={`h-11 rounded-xl border font-mono-num font-bold ${trainingDaysPerWeek === days ? 'border-[#FF6B1A] bg-[#FF6B1A] text-white' : 'border-white/[0.08] bg-[#11161C] text-[#A7B0BA]'}`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="cl-label flex items-center gap-2"><Timer className="w-4 h-4" /> Minutos por treino</span>
                <div role="radiogroup" aria-label="Minutos por treino" className="mt-3 grid grid-cols-3 gap-2">
                  {DURATIONS.map((minutes) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={sessionDurationMinutes === minutes}
                      key={minutes}
                      onClick={() => setSessionDurationMinutes(minutes)}
                      className={`h-11 rounded-xl border font-mono-num font-bold ${sessionDurationMinutes === minutes ? 'border-[#FF6B1A] bg-[#FF6B1A] text-white' : 'border-white/[0.08] bg-[#11161C] text-[#A7B0BA]'}`}
                    >
                      {minutes}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {error && <div role="alert" aria-live="assertive" className="p-4 rounded-2xl border border-red-400/25 bg-red-400/[0.06] text-sm text-red-300">{error}</div>}

          <button
            type="submit"
            disabled={loading || !trainingFocus}
            className="w-full min-h-13 rounded-xl bg-[#FF6B1A] hover:bg-[#FF7A2E] disabled:opacity-45 disabled:cursor-not-allowed cl-button-text text-white flex items-center justify-center gap-2"
          >
            {loading ? 'Montando seu plano...' : 'Criar meu plano inicial'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </main>
    </div>
  );
};
