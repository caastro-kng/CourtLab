import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { DrillModal } from '../common/DrillModal';
import { WorkoutPlayer } from '../workout-player/WorkoutPlayer';
import { Exercise } from '../../types';
import { usePlayer } from '../../context/PlayerContext';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { activeWorkout, startWorkout, finishActiveWorkout } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#080A0D] text-white flex flex-col font-sans bg-court-pattern antialiased">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden min-w-0">
          <Outlet context={{ onSelectExercise: setSelectedExercise }} />
        </main>
      </div>

      <MobileNav />

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

      <DrillModal
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          onClose={finishActiveWorkout}
        />
      )}
    </div>
  );
};
