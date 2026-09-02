/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Layout } from './components/layout/Layout';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const MyPlan = lazy(() => import('./pages/MyPlan').then((module) => ({ default: module.MyPlan })));
const TrainHub = lazy(() => import('./pages/TrainHub').then((module) => ({ default: module.TrainHub })));
const Library = lazy(() => import('./pages/Library').then((module) => ({ default: module.Library })));
const Programs = lazy(() => import('./pages/Programs').then((module) => ({ default: module.Programs })));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail').then((module) => ({ default: module.ProgramDetail })));
const Fundamentals = lazy(() => import('./pages/Fundamentals').then((module) => ({ default: module.Fundamentals })));
const Progress = lazy(() => import('./pages/Progress').then((module) => ({ default: module.Progress })));
const Goals = lazy(() => import('./pages/Goals').then((module) => ({ default: module.Goals })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));

const PageFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center px-6">
    <div className="flex items-center gap-3 text-sm text-[#9AA1AA]" role="status" aria-live="polite">
      <span className="h-5 w-5 rounded-full border-2 border-[#2B3542] border-t-[#FF6B1A] animate-spin" aria-hidden="true" />
      <span>Carregando...</span>
    </div>
  </div>
);

const PlayerGate: React.FC = () => {
  const { playerReady, profile } = usePlayer();

  if (!playerReady) {
    return (
      <div className="min-h-screen bg-[#080A0D] text-white flex items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-[#9AA1AA]" role="status" aria-live="polite">
          <span className="h-5 w-5 rounded-full border-2 border-[#2B3542] border-t-[#FF6B1A] animate-spin" aria-hidden="true" />
          <span>Carregando seu perfil...</span>
        </div>
      </div>
    );
  }

  if (!profile.onboardingCompleted) return <Onboarding />;

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="plano" element={<MyPlan />} />
          <Route path="treinar" element={<TrainHub />} />
          <Route path="biblioteca" element={<Library />} />
          <Route path="programas" element={<Programs />} />
          <Route path="programas/:slug" element={<ProgramDetail />} />
          <Route path="fundamentos" element={<Fundamentals />} />
          <Route path="progresso" element={<Progress />} />
          <Route path="metas" element={<Goals />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const SessionGate: React.FC = () => {
  const { session, loading, passwordRecovery } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A0D] text-white flex items-center justify-center px-6">
        <div className="flex items-center gap-3 text-sm text-[#9AA1AA]" role="status" aria-live="polite">
          <span className="h-5 w-5 rounded-full border-2 border-[#2B3542] border-t-[#FF6B1A] animate-spin" aria-hidden="true" />
          <span>Preparando sua sessão...</span>
        </div>
      </div>
    );
  }

  if (passwordRecovery) return <Auth initialMode="recovery" />;
  if (!session) return <Auth />;

  return (
    <PlayerProvider>
      <PlayerGate />
    </PlayerProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SessionGate />
      </BrowserRouter>
    </AuthProvider>
  );
}
