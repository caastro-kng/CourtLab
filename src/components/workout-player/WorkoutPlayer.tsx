import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Flame,
  Award,
  Clock,
  Shield,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Workout, Exercise } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { CourtDiagram } from '../common/CourtDiagram';

interface WorkoutPlayerProps {
  workout: Workout;
  onClose: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ workout, onClose }) => {
  const { getExerciseById, completeWorkoutSession } = usePlayer();

  // Active workout states
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeDrillTimer, setActiveDrillTimer] = useState(45);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Completion states
  const [isCompleted, setIsCompleted] = useState(false);
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<'Muito difícil' | 'Difícil' | 'Bom' | 'Fácil'>('Bom');
  const [shotsLogged, setShotsLogged] = useState(50);

  const totalExercises = workout.exercises.length;
  const currentItem = workout.exercises[currentExerciseIndex];
  const exercise: Exercise | undefined = getExerciseById(currentItem.exerciseId);

  const targetSets = currentItem.customSets || exercise?.sets || 3;
  const restDuration = currentItem.restSeconds || 30;

  // Track overall session time
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTotalSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Rest countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            playBeep();
            return restDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft, restDuration]);

  // Active drill stopwatch
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && activeDrillTimer > 0) {
      timer = setInterval(() => {
        setActiveDrillTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, activeDrillTimer]);

  const playBeep = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  const handleCompleteSet = () => {
    playBeep();
    if (currentSet < targetSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true);
      setRestSecondsLeft(restDuration);
    } else {
      // Completed all sets for this drill
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setIsResting(true);
        setRestSecondsLeft(restDuration + 15); // Extra rest between exercises
        setActiveDrillTimer(45);
      } else {
        // Workout Finished!
        triggerCelebration();
      }
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setActiveDrillTimer(45);
    } else {
      triggerCelebration();
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
      setActiveDrillTimer(45);
    }
  };

  const triggerCelebration = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B1A', '#FFFFFF', '#FF8D4D', '#10B981']
    });
  };

  const handleSaveWorkout = () => {
    const minutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    completeWorkoutSession({
      workoutId: workout.id,
      workoutTitle: workout.title,
      durationMinutes: minutes,
      exercisesCompleted: totalExercises,
      totalSets: totalExercises * 3,
      totalReps: totalExercises * 20,
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

  // Completion Screen (Section 32)
  if (isCompleted) {
    const totalMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));

    return (
      <div className="fixed inset-0 z-50 bg-[#080A0D] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="max-w-xl mx-auto w-full pt-6 pb-12 flex-1 flex flex-col justify-center text-center">
          {/* Trophy / Fire Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#FF6B1A] to-[#FF8D4D] p-1 flex items-center justify-center shadow-2xl shadow-[#FF6B1A]/40 animate-bounce">
            <div className="w-full h-full bg-[#0D1014] rounded-[22px] flex items-center justify-center">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF6B1A]" />
            </div>
          </div>

          <span className="text-xs uppercase font-mono-num font-bold tracking-widest text-[#FF8D4D] block mb-1">
            Missão Cumprida
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-none mb-2">
            TREINO CONCLUÍDO 🔥
          </h1>
          <p className="text-sm sm:text-base text-[#9AA1AA] max-w-md mx-auto mb-8">
            Mais um passo no seu jogo. A consistência diária é o segredo da elite.
          </p>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-2xl bg-[#15191F] border border-[#1F2630] text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Tempo</span>
              <span className="text-xl sm:text-2xl font-mono-num font-bold text-white">{totalMinutes} min</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Exercícios</span>
              <span className="text-xl sm:text-2xl font-mono-num font-bold text-white">{totalExercises}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">XP Ganho</span>
              <span className="text-xl sm:text-2xl font-mono-num font-bold text-[#FF6B1A]">+{workout.xpReward + 25} XP</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Sequência</span>
              <span className="text-xl sm:text-2xl font-mono-num font-bold text-emerald-400">🔥 4 dias</span>
            </div>
          </div>

          {/* Perceived Difficulty Feedback (Section 31) */}
          <div className="p-5 rounded-2xl bg-[#15191F] border border-[#1F2630] mb-8 text-left">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#9AA1AA] mb-3">
              Como foi a intensidade do treino hoje?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Muito difícil', icon: '😫' },
                { label: 'Difícil', icon: '😐' },
                { label: 'Bom', icon: '🙂' },
                { label: 'Fácil', icon: '🔥' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setPerceivedDifficulty(item.label as any)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                    perceivedDifficulty === item.label
                      ? 'bg-[#FF6B1A]/20 border-[#FF6B1A] text-white'
                      : 'bg-[#11151A] border-[#1F2630] text-[#9AA1AA] hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arremessos convertidos logger */}
          <div className="p-4 rounded-xl bg-[#11151A] border border-[#1F2630] mb-8 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9AA1AA]">Arremessos registrados na sessão:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShotsLogged((p) => Math.max(0, p - 10))}
                className="w-8 h-8 rounded-lg bg-[#1F2630] text-white font-bold"
              >
                -
              </button>
              <span className="font-mono-num font-bold text-white px-2">{shotsLogged}</span>
              <button
                onClick={() => setShotsLogged((p) => p + 10)}
                className="w-8 h-8 rounded-lg bg-[#FF6B1A] text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Register CTA */}
          <button
            onClick={handleSaveWorkout}
            className="w-full py-4 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] text-white text-base sm:text-lg font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#FF6B1A]/30 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            Registrar Treino
          </button>
        </div>
      </div>
    );
  }

  // Active In-Court Workout Screen (Sections 30 & 45)
  return (
    <div className="fixed inset-0 z-50 bg-[#080A0D] text-white flex flex-col justify-between select-none">
      {/* Top Focused Header */}
      <div className="px-4 py-3 sm:px-6 border-b border-[#1F2630] bg-[#0D1014] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#15191F] text-[#9AA1AA] hover:text-white border border-[#1F2630]"
            aria-label="Sair do treino"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-mono-num font-bold tracking-widest text-[#FF6B1A] block">
              EXERCÍCIO {currentExerciseIndex + 1} DE {totalExercises}
            </span>
            <h2 className="text-sm sm:text-base font-heading text-white line-clamp-1">
              {workout.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1 rounded-lg bg-[#15191F] border border-[#1F2630] text-xs font-mono-num font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />
            {formatTime(totalSecondsElapsed)}
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-[#15191F] text-[#9AA1AA] hover:text-white border border-[#1F2630]"
            aria-label="Silenciar alertas de áudio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Progress Bar of the Workout */}
      <div className="w-full bg-[#15191F] h-1.5 flex-shrink-0">
        <div
          className="bg-[#FF6B1A] h-full transition-all duration-300"
          style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
        />
      </div>

      {/* Main Focus Stage */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between max-w-3xl mx-auto w-full">
        {/* Rest Overlay mode */}
        {isResting ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-200">
            <span className="text-xs uppercase font-mono-num font-bold tracking-widest text-emerald-400 mb-2">
              Intervalo de Recuperação
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading text-white mb-6">
              DESCANSO ATIVO
            </h3>

            {/* Giant Countdown Clock */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center mb-6 bg-[#0D1014] shadow-2xl shadow-emerald-500/10">
              <span className="text-5xl sm:text-7xl font-mono-num font-black text-emerald-400">
                {restSecondsLeft}
              </span>
              <span className="text-xs font-mono-num uppercase text-[#9AA1AA] mt-1">segundos</span>
            </div>

            <p className="text-xs sm:text-sm text-[#9AA1AA] max-w-sm mb-6">
              Respire fundo, hidrate-se e prepare-se para a próxima série.
            </p>

            <button
              onClick={() => setIsResting(false)}
              className="px-6 py-3 rounded-xl bg-[#191E24] hover:bg-[#202730] border border-[#2B3542] text-xs sm:text-sm font-bold uppercase tracking-wider text-white"
            >
              Pular Descanso ➔
            </button>
          </div>
        ) : (
          /* Active Drill Focus View */
          <div className="space-y-4">
            {/* Top Drill Info Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#15191F] border border-[#1F2630]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-white">
                  {exercise?.categoryLabel}
                </span>
                <span className="text-xs font-mono-num font-bold text-[#FF8D4D]">
                  Série {currentSet} de {targetSets}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading text-white tracking-tight leading-tight">
                {exercise?.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#9AA1AA] mt-1">
                {exercise?.subcategory} • Meta: <strong className="text-white">{currentItem.customReps || exercise?.reps}</strong>
              </p>
            </div>

            {/* In-Court Stopwatch / Countdown Block */}
            <div className="p-5 rounded-2xl bg-[#11151A] border border-[#1F2630] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-[#9AA1AA] block">Cronômetro do Exercício</span>
                <div className="text-4xl sm:text-5xl font-mono-num font-bold text-white tracking-wider">
                  00:{activeDrillTimer.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                    isTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isTimerRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setActiveDrillTimer(45);
                  }}
                  className="p-3 rounded-xl bg-[#191E24] text-[#9AA1AA] hover:text-white border border-[#2B3542]"
                  aria-label="Reiniciar cronômetro"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tactical Instructions Preview */}
            <div className="p-4 rounded-xl bg-[#15191F]/70 border border-[#1F2630] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#FF6B1A] block">
                Foco de Execução
              </span>
              <p className="text-xs sm:text-sm text-[#FFFFFF] leading-relaxed">
                {exercise?.instructions[0]}
              </p>
              {exercise?.tips[0] && (
                <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 pt-1 border-t border-[#1F2630]/60">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Dica de ouro: {exercise.tips[0]}</span>
                </div>
              )}
            </div>

            {/* Tactical placement court view */}
            <CourtDiagram placement={exercise?.courtPlacement || 'top'} className="max-h-40" />
          </div>
        )}
      </div>

      {/* Prominent Large Bottom Actions (Section 45: Court Mobile Ergonomics) */}
      <div className="p-4 border-t border-[#1F2630] bg-[#0D1014] flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-4">
          <button
            onClick={handlePrevExercise}
            disabled={currentExerciseIndex === 0}
            className="p-3.5 rounded-2xl bg-[#15191F] disabled:opacity-30 text-white border border-[#1F2630] hover:bg-[#1C222B] transition-colors"
            aria-label="Exercício anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Big In-Court Main Button */}
          <button
            onClick={handleCompleteSet}
            className="flex-1 py-4 sm:py-5 px-6 rounded-2xl bg-[#FF6B1A] hover:bg-[#FF7A2E] active:scale-95 text-white font-heading text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl shadow-[#FF6B1A]/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>
              {currentSet < targetSets ? `Concluir Série ${currentSet}` : `Concluir Exercício ➔`}
            </span>
          </button>

          <button
            onClick={handleNextExercise}
            className="p-3.5 rounded-2xl bg-[#15191F] text-white border border-[#1F2630] hover:bg-[#1C222B] transition-colors"
            aria-label="Próximo exercício"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
