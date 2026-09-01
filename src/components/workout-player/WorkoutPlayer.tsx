import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Shield,
  SkipForward,
  Trophy,
  TimerReset,
  Minus,
  Plus,
  Video,
  ExternalLink,
  Eye,
  EyeOff,
  Focus,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Workout, Exercise } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { EXERCISE_VIDEO_SOURCES } from '../../data/exerciseVideos';
import { CourtDiagram } from '../common/CourtDiagram';

interface WorkoutPlayerProps {
  workout: Workout;
  onClose: () => void;
}

type Difficulty = 'Muito difícil' | 'Difícil' | 'Bom' | 'Fácil';
type RestContext = 'between-sets' | 'between-exercises';

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ workout, onClose }) => {
  const { getExerciseById, completeWorkoutSession, currentStreakDays } = usePlayer();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restContext, setRestContext] = useState<RestContext>('between-sets');
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeDrillTimer, setActiveDrillTimer] = useState(45);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [resumeTimerAfterVideo, setResumeTimerAfterVideo] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<Difficulty>('Bom');
  const [shotsLogged, setShotsLogged] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);

  const totalExercises = workout.exercises.length;
  const currentItem = workout.exercises[currentExerciseIndex];
  const exercise: Exercise | undefined = currentItem ? getExerciseById(currentItem.exerciseId) : undefined;
  const targetSets = currentItem?.customSets || exercise?.sets || 3;
  const restDuration = currentItem?.restSeconds || 30;
  const videoSource = exercise ? EXERCISE_VIDEO_SOURCES[exercise.id] : undefined;
  const videoWatchCue = exercise?.tips?.[0]
    || exercise?.instructions?.[1]
    || 'Observe postura, ritmo, base e controle antes de repetir o movimento.';

  const videoEmbedUrl = useMemo(() => {
    if (!exercise) return null;
    if (exercise.youtubeId) return `https://www.youtube-nocookie.com/embed/${exercise.youtubeId}`;
    if (!exercise.videoUrl) return null;

    try {
      const url = new URL(exercise.videoUrl);
      const videoId = url.hostname.includes('youtu.be')
        ? url.pathname.replace('/', '')
        : url.searchParams.get('v');
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  }, [exercise]);

  const totalPlannedSets = useMemo(
    () => workout.exercises.reduce((sum, item) => {
      const itemExercise = getExerciseById(item.exerciseId);
      return sum + (item.customSets || itemExercise?.sets || 3);
    }, 0),
    [workout.exercises, getExerciseById]
  );

  const progressPercent = totalPlannedSets > 0
    ? Math.min(100, Math.round((completedSets / totalPlannedSets) * 100))
    : Math.round(((currentExerciseIndex + 1) / Math.max(1, totalExercises)) * 100);

  const shouldReduceDetails = focusMode || isTimerRunning;

  useEffect(() => {
    if (isCompleted) return;
    const interval = window.setInterval(() => setTotalSecondsElapsed((prev) => prev + 1), 1000);
    return () => window.clearInterval(interval);
  }, [isCompleted]);

  useEffect(() => {
    if (!isResting || restSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          setIsResting(false);
          return restDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isResting, restSecondsLeft, restDuration, isMuted]);

  useEffect(() => {
    if (!isTimerRunning || activeDrillTimer <= 0) return;
    const timer = window.setInterval(() => {
      setActiveDrillTimer((prev) => {
        if (prev <= 1) {
          playBeep();
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isTimerRunning, activeDrillTimer, isMuted]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    setShowVideo(false);
    setResumeTimerAfterVideo(false);
  }, [currentExerciseIndex]);

  useEffect(() => {
    if (!showVideo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeVideoDemo();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showVideo, resumeTimerAfterVideo, activeDrillTimer]);

  const playBeep = () => {
    if (isMuted) return;
    try {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextCtor();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.frequency.setValueAtTime(820, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
    } catch {
      // Browsers may block audio before an explicit interaction.
    }
  };

  const resetDrillTimer = () => {
    setIsTimerRunning(false);
    setActiveDrillTimer(45);
  };

  const openVideoDemo = () => {
    setResumeTimerAfterVideo(isTimerRunning);
    setIsTimerRunning(false);
    setShowVideo(true);
  };

  const closeVideoDemo = () => {
    setShowVideo(false);
    if (resumeTimerAfterVideo && activeDrillTimer > 0) setIsTimerRunning(true);
    setResumeTimerAfterVideo(false);
  };

  const triggerCelebration = () => {
    setIsTimerRunning(false);
    setIsResting(false);
    setShowVideo(false);
    setIsCompleted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FF6B1A', '#FFFFFF', '#FF8D4D', '#10B981']
    });
  };

  const moveToExercise = (nextIndex: number) => {
    setCurrentExerciseIndex(nextIndex);
    setCurrentSet(1);
    setIsResting(false);
    setShowVideo(false);
    resetDrillTimer();
  };

  const handleCompleteSet = () => {
    if (isResting) {
      setIsResting(false);
      return;
    }

    playBeep();
    setIsTimerRunning(false);
    setCompletedSets((prev) => Math.min(totalPlannedSets, prev + 1));

    if (currentSet < targetSets) {
      setCurrentSet((prev) => prev + 1);
      setRestContext('between-sets');
      setRestSecondsLeft(restDuration);
      setIsResting(true);
      return;
    }

    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setRestContext('between-exercises');
      setRestSecondsLeft(restDuration + 15);
      setIsResting(true);
      resetDrillTimer();
      return;
    }

    triggerCelebration();
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) moveToExercise(currentExerciseIndex + 1);
    else triggerCelebration();
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) moveToExercise(currentExerciseIndex - 1);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  const handleSaveWorkout = () => {
    const minutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    completeWorkoutSession({
      workoutId: workout.id,
      workoutTitle: workout.title,
      durationMinutes: minutes,
      exercisesCompleted: totalExercises,
      totalSets: totalPlannedSets,
      totalReps: workout.exercises.reduce((sum, item) => {
        const reps = Number.parseInt(String(item.customReps || ''), 10);
        return sum + (Number.isFinite(reps) ? reps * (item.customSets || 3) : 0);
      }, 0),
      shotsMade: shotsLogged,
      xpEarned: workout.xpReward + 25,
      perceivedDifficulty
    });
    onClose();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!currentItem || !exercise) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080A0D] text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-heading">Não foi possível abrir este exercício.</h2>
          <p className="text-sm text-[#9AA1AA]">O treino contém um exercício que não está disponível na biblioteca atual.</p>
          <button onClick={onClose} className="px-5 py-3 rounded-xl bg-[#FF6B1A] font-bold">Voltar</button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const totalMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    const difficultyOptions: { label: Difficulty; text: string }[] = [
      { label: 'Muito difícil', text: 'Pesado' },
      { label: 'Difícil', text: 'Difícil' },
      { label: 'Bom', text: 'Na medida' },
      { label: 'Fácil', text: 'Leve' }
    ];

    return (
      <div className="fixed inset-0 z-50 bg-[#080A0D] text-white overflow-y-auto">
        <div className="min-h-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FF6B1A]/12 border border-[#FF6B1A]/35 flex items-center justify-center mb-5">
              <Trophy className="w-9 h-9 text-[#FF6B1A]" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF8D4D]">Sessão finalizada</span>
            <h1 className="text-4xl sm:text-5xl font-heading tracking-tight mt-1">TREINO CONCLUÍDO</h1>
            <p className="text-sm text-[#9AA1AA] mt-2">Registre como a sessão foi e mantenha seu histórico atualizado.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            {[
              ['Tempo', `${totalMinutes} min`],
              ['Exercícios', String(totalExercises)],
              ['Séries', String(totalPlannedSets)],
              ['XP', `+${workout.xpReward + 25}`]
            ].map(([label, value]) => (
              <div key={label} className="p-4 rounded-2xl bg-[#11151A] border border-[#1F2630]">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#707985] block">{label}</span>
                <span className={`text-xl font-mono-num font-bold ${label === 'XP' ? 'text-[#FF6B1A]' : 'text-white'}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-[#0D1014] border border-[#1F2630] space-y-5 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Como ficou a intensidade?</h3>
              <p className="text-xs text-[#707985] mt-0.5">Isso ajuda a ajustar seus próximos treinos.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {difficultyOptions.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setPerceivedDifficulty(item.label)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-colors ${perceivedDifficulty === item.label ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] text-white' : 'bg-[#11151A] border-[#1F2630] text-[#9AA1AA]'}`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1F2630]">
              <div>
                <span className="text-sm font-bold text-white block">Arremessos convertidos</span>
                <span className="text-xs text-[#707985]">Opcional para sessões com shooting.</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShotsLogged((p) => Math.max(0, p - 5))} className="w-10 h-10 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-center" aria-label="Diminuir arremessos"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-mono-num font-bold text-lg">{shotsLogged}</span>
                <button onClick={() => setShotsLogged((p) => p + 5)} className="w-10 h-10 rounded-xl bg-[#FF6B1A] flex items-center justify-center" aria-label="Aumentar arremessos"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5 px-1 text-xs text-[#9AA1AA]">
            <Flame className="w-4 h-4 text-[#FF6B1A]" />
            Sua sequência atual é de <strong className="text-white">{currentStreakDays} dias</strong>.
          </div>

          <button onClick={handleSaveWorkout} className="w-full min-h-14 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white font-heading uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B1A]/20">
            <CheckCircle2 className="w-5 h-5" />
            Registrar treino
          </button>
        </div>
      </div>
    );
  }

  const footerLabel = isResting
    ? restContext === 'between-exercises' ? 'Começar próximo drill' : `Começar série ${currentSet}`
    : currentSet < targetSets
      ? 'Concluir série'
      : currentExerciseIndex < totalExercises - 1
        ? 'Concluir exercício'
        : 'Finalizar treino';

  return (
    <div className="fixed inset-0 z-50 bg-[#080A0D] text-white flex flex-col select-none">
      <header className="flex-shrink-0 bg-[#0B0E12]/96 backdrop-blur-xl border-b border-white/[0.06] pt-[env(safe-area-inset-top)]">
        <div className="h-15 sm:h-16 max-w-5xl mx-auto px-3 sm:px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button onClick={() => setShowExitConfirm(true)} className="w-10 h-10 rounded-xl bg-[#15191F] border border-white/[0.06] flex items-center justify-center text-[#9AA1AA] hover:text-white" aria-label="Sair do treino"><X className="w-5 h-5" /></button>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#FF6B1A] block">Modo quadra</span>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate">{workout.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-xl bg-[#11151A] border border-white/[0.06] text-xs font-mono-num font-bold"><Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />{formatTime(totalSecondsElapsed)}</div>
            <button onClick={() => setFocusMode((value) => !value)} className={`w-9 h-9 rounded-xl border flex items-center justify-center ${focusMode ? 'bg-[#FF6B1A]/12 border-[#FF6B1A]/30 text-[#FF8D4D]' : 'bg-[#11151A] border-white/[0.06] text-[#9AA1AA]'}`} aria-label={focusMode ? 'Sair do modo foco' : 'Ativar modo foco'} title={focusMode ? 'Sair do modo foco' : 'Modo foco'}>{focusMode ? <EyeOff className="w-4 h-4" /> : <Focus className="w-4 h-4" />}</button>
            <button onClick={() => setIsMuted((v) => !v)} className="w-9 h-9 rounded-xl bg-[#11151A] border border-white/[0.06] flex items-center justify-center text-[#9AA1AA]" aria-label={isMuted ? 'Ativar áudio' : 'Silenciar áudio'}>{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}</button>
            <button onClick={toggleFullscreen} className="hidden sm:flex w-9 h-9 rounded-xl bg-[#11151A] border border-white/[0.06] items-center justify-center text-[#9AA1AA]" aria-label="Alternar tela cheia">{isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>
          </div>
        </div>

        <div className="h-1 bg-[#15191F]">
          <div className="h-full bg-[#FF6B1A] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="max-w-5xl mx-auto min-h-full px-4 sm:px-6 py-4 sm:py-7 flex flex-col">
          {isResting ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-5 sm:py-8">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-400">{restContext === 'between-exercises' ? 'Transição de drill' : 'Recuperação entre séries'}</span>
              <h1 className="text-3xl sm:text-5xl font-heading mt-1">{restContext === 'between-exercises' ? 'PRÓXIMO DRILL' : 'DESCANSO'}</h1>

              <div className="my-5 sm:my-7 w-44 h-44 sm:w-56 sm:h-56 rounded-full border-[6px] border-emerald-500/15 bg-[#0D1014] flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/5">
                <span className="text-6xl sm:text-8xl font-mono-num font-black text-emerald-400 leading-none">{restSecondsLeft}</span>
                <span className="text-[10px] uppercase tracking-widest text-[#707985] mt-2">segundos</span>
              </div>

              <div className="w-full max-w-xl border-y border-white/[0.06] py-4 sm:py-5 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B1A]/10 flex items-center justify-center shrink-0"><Footprints className="w-5 h-5 text-[#FF6B1A]" /></div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#737D88]">{restContext === 'between-exercises' ? 'Você vai fazer agora' : `Próxima série · ${currentSet}/${targetSets}`}</span>
                    <h2 className="text-lg sm:text-xl font-heading text-white mt-0.5">{exercise.name}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8F98A4] mt-1.5">
                      <span>{currentItem.customReps || exercise.reps || 'Qualidade máxima'}</span>
                      <span>{exercise.categoryLabel}</span>
                      {(videoEmbedUrl || exercise.videoUrl) && <button onClick={openVideoDemo} className="text-[#FF8D4D] font-bold inline-flex items-center gap-1"><Video className="w-3.5 h-3.5" />Ver vídeo</button>}
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsResting(false)} className="mt-5 min-h-12 px-6 rounded-xl bg-[#15191F] border border-white/[0.08] font-bold text-xs uppercase tracking-wider flex items-center gap-2"><SkipForward className="w-4 h-4" />Pular descanso</button>
            </div>
          ) : (
            <div className={`flex-1 ${shouldReduceDetails ? 'flex flex-col justify-center' : 'grid lg:grid-cols-[1fr_300px] gap-5 lg:gap-7'}`}>
              <section className={`flex flex-col ${shouldReduceDetails ? 'gap-5' : 'gap-4'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF8D4D]">Exercício {currentExerciseIndex + 1} de {totalExercises}</span>
                    <h1 className={`${shouldReduceDetails ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-5xl'} font-heading leading-[0.95] mt-1`}>{exercise.name}</h1>
                    {!shouldReduceDetails && <p className="text-sm text-[#9AA1AA] mt-2">{exercise.categoryLabel} • {exercise.subcategory}</p>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-[9px] uppercase font-bold text-[#707985] block">Série</span>
                    <span className="text-3xl sm:text-4xl font-mono-num font-black text-[#FF6B1A]">{currentSet}/{targetSets}</span>
                  </div>
                </div>

                <div className={`bg-[#0D1014] border border-white/[0.06] overflow-hidden ${shouldReduceDetails ? 'rounded-[28px]' : 'rounded-3xl'}`}>
                  <div className={`${shouldReduceDetails ? 'p-5 sm:p-8' : 'p-5 sm:p-6'} flex flex-col sm:flex-row sm:items-end justify-between gap-5`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#707985]">Cronômetro</span>
                        {isTimerRunning && <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">• em andamento</span>}
                      </div>
                      <div className={`${shouldReduceDetails ? 'text-7xl sm:text-8xl lg:text-9xl' : 'text-6xl sm:text-7xl'} font-mono-num font-black tracking-tight leading-none mt-1`}>{formatTime(activeDrillTimer)}</div>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => setActiveDrillTimer((v) => Math.max(5, v - 15))} className="px-3 py-1.5 rounded-lg bg-[#15191F] border border-white/[0.06] text-xs font-bold">-15s</button>
                        <button onClick={() => setActiveDrillTimer((v) => v + 15)} className="px-3 py-1.5 rounded-lg bg-[#15191F] border border-white/[0.06] text-xs font-bold">+15s</button>
                        <button onClick={resetDrillTimer} className="w-8 h-8 rounded-lg bg-[#15191F] border border-white/[0.06] flex items-center justify-center" aria-label="Reiniciar cronômetro"><TimerReset className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <button onClick={() => setIsTimerRunning((v) => !v)} className={`w-full sm:w-auto min-h-16 sm:min-h-14 px-7 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.99] ${isTimerRunning ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'}`}>{isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}{isTimerRunning ? 'Pausar' : activeDrillTimer === 0 ? 'Reiniciar' : 'Iniciar timer'}</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/[0.06] border-y border-white/[0.06]">
                  <div className="bg-[#080A0D] py-3 pr-4"><span className="text-[9px] uppercase text-[#737D88] block">Meta</span><strong className="text-sm sm:text-base text-white">{currentItem.customReps || exercise.reps || 'Qualidade máxima'}</strong></div>
                  <div className="bg-[#080A0D] py-3 pl-4"><span className="text-[9px] uppercase text-[#737D88] block">Progresso</span><strong className="text-sm sm:text-base text-white">{completedSets}/{totalPlannedSets} séries</strong></div>
                </div>

                {(videoEmbedUrl || exercise.videoUrl) && (
                  <button onClick={openVideoDemo} className="min-h-12 px-4 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/25 text-[#FF8D4D] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" /> Ver demonstração
                  </button>
                )}

                {!shouldReduceDetails && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-[#11151A] border border-white/[0.06]">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#FF6B1A]">Execução</span>
                        <p className="text-sm text-white leading-relaxed mt-1.5">{exercise.instructions?.[0] || 'Execute com controle, postura e intenção de jogo.'}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#11151A] border border-white/[0.06]">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Ponto-chave</span>
                        <p className="text-sm text-[#D7DBE0] leading-relaxed mt-1.5">{exercise.tips?.[0] || 'Mantenha qualidade antes de aumentar velocidade.'}</p>
                      </div>
                    </div>
                    <CourtDiagram placement={exercise.courtPlacement || 'top'} className="max-h-44 sm:max-h-52" />
                  </>
                )}
              </section>

              {!shouldReduceDetails && (
                <aside className="space-y-3">
                  <div className="p-4 border-y border-white/[0.06]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#707985]">Meta da série</span>
                    <div className="text-xl font-mono-num font-bold mt-1">{currentItem.customReps || exercise.reps || 'Qualidade máxima'}</div>
                    <div className="text-xs text-[#9AA1AA] mt-2">Descanso programado: {restDuration}s</div>
                  </div>

                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs mb-2"><span className="font-bold text-white">Progresso</span><span className="font-mono-num text-[#FF6B1A]">{progressPercent}%</span></div>
                    <div className="h-2 bg-[#15191F] rounded-full overflow-hidden"><div className="h-full bg-[#FF6B1A] rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div>
                    <p className="text-[11px] text-[#707985] mt-2">{completedSets} de {totalPlannedSets} séries concluídas</p>
                  </div>

                  <div className="hidden lg:block p-4">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#707985]">Tempo de sessão</span>
                    <div className="text-2xl font-mono-num font-bold mt-1">{formatTime(totalSecondsElapsed)}</div>
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0 bg-[#0B0E12]/98 border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-2 sm:gap-3">
          <button onClick={handlePrevExercise} disabled={currentExerciseIndex === 0 || isResting} className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#15191F] border border-white/[0.06] items-center justify-center disabled:opacity-25" aria-label="Exercício anterior"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={handleCompleteSet} className={`flex-1 min-h-16 sm:min-h-16 rounded-2xl font-heading text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.99] ${isResting ? 'bg-emerald-400 text-black' : 'bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white shadow-lg shadow-[#FF6B1A]/20'}`}>{isResting ? <Play className="w-5 h-5 fill-current" /> : <CheckCircle2 className="w-5 h-5" />}{footerLabel}</button>
          <button onClick={handleNextExercise} disabled={isResting} className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#15191F] border border-white/[0.06] items-center justify-center disabled:opacity-25" aria-label="Próximo exercício"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </footer>

      {showVideo && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5" role="dialog" aria-modal="true" aria-label={`Demonstração de ${exercise.name}`}>
          <div className="w-full max-w-3xl max-h-[94dvh] sm:max-h-[92vh] rounded-t-[28px] sm:rounded-3xl bg-[#0D1014] border border-[#2B3542] overflow-y-auto overscroll-contain shadow-2xl pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-5 bg-[#0D1014]/95 backdrop-blur-xl border-b border-[#1F2630]">
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#FF6B1A]">Demonstração técnica</span>
                <h3 className="text-lg sm:text-xl font-heading text-white truncate">{exercise.name}</h3>
              </div>
              <button onClick={closeVideoDemo} className="w-10 h-10 rounded-xl bg-[#15191F] border border-[#1F2630] flex items-center justify-center text-[#9AA1AA] hover:text-white shrink-0" aria-label="Fechar vídeo"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-3 sm:p-5">
              {videoEmbedUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-[#1F2630]">
                  <iframe
                    src={videoEmbedUrl}
                    title={`Demonstração de ${exercise.name}`}
                    className="w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-[#2B3542] bg-[#11151A] p-6 text-center">
                  <Video className="w-8 h-8 text-[#FF6B1A] mx-auto mb-2" />
                  <p className="text-sm text-white font-bold">A demonstração abre no YouTube.</p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="rounded-2xl bg-[#11151A] border border-[#1F2630] p-4">
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />O que observar</span>
                <p className="text-sm text-white leading-relaxed mt-1.5">{videoWatchCue}</p>
              </div>

              {videoSource?.source && (
                <div className="flex items-start gap-3 px-1">
                  <div className="w-8 h-8 rounded-lg bg-[#15191F] border border-[#1F2630] flex items-center justify-center shrink-0"><Video className="w-4 h-4 text-[#FF8D4D]" /></div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#707985] block">Fonte do vídeo</span>
                    <span className="text-xs sm:text-sm text-[#D7DBE0] leading-relaxed block mt-0.5">{videoSource.source}</span>
                  </div>
                </div>
              )}

              <div className="text-xs text-[#9AA1AA] px-1">
                {resumeTimerAfterVideo ? 'O cronômetro foi pausado e volta ao fechar o vídeo.' : 'O cronômetro permanece pausado enquanto você assiste.'}
              </div>
            </div>

            <div className="sticky bottom-0 z-10 p-4 sm:p-5 pt-3 bg-[#0D1014]/95 backdrop-blur-xl border-t border-[#1F2630]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {exercise.videoUrl && (
                  <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="min-h-12 px-4 rounded-xl bg-[#15191F] border border-[#2B3542] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />Abrir no YouTube
                  </a>
                )}
                <button onClick={closeVideoDemo} className="min-h-12 px-5 rounded-xl bg-[#FF6B1A] text-xs font-bold uppercase tracking-wider">Voltar ao treino</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0D1014] border border-[#2B3542] p-5 shadow-2xl">
            <h3 className="text-xl font-heading">Sair do treino?</h3>
            <p className="text-sm text-[#9AA1AA] mt-2">O progresso desta sessão ainda não será registrado.</p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => setShowExitConfirm(false)} className="min-h-12 rounded-xl bg-[#15191F] border border-[#1F2630] font-bold text-xs uppercase">Continuar</button>
              <button onClick={onClose} className="min-h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-bold text-xs uppercase">Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
