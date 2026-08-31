import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { DrillModal } from '../common/DrillModal';
import { WorkoutPlayer } from '../workout-player/WorkoutPlayer';
import { Exercise, Workout } from '../../types';
import { usePlayer } from '../../context/PlayerContext';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { activeWorkout, startWorkout, finishActiveWorkout } = usePlayer();
  const navigate = useNavigate();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#080A0D] text-white flex flex-col font-sans bg-court-pattern antialiased">
      {/* Top Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex flex-1">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Main Content View */}
        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden min-w-0">
          <Outlet context={{ onSelectExercise: setSelectedExercise }} />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileNav />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectExercise={(exercise) => {
          setIsSearchOpen(false);
          setSelectedExercise(exercise);
        }}
        onSelectWorkout={(workout) => {
          setIsSearchOpen(false);
          startWorkout(workout);
        }}
      />

      {/* Deep-Dive Drill Modal */}
      <DrillModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onStartDrill={(exercise) => {
          setSelectedExercise(null);
          navigate(`/treinar?exerciseId=${exercise.id}`);
        }}
      />

      {/* Active Workout In-Court Player */}
      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          onClose={finishActiveWorkout}
        />
      )}
    </div>
  );
};
