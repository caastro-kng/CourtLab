/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyPlan } from './pages/MyPlan';
import { TrainHub } from './pages/TrainHub';
import { Library } from './pages/Library';
import { Programs } from './pages/Programs';
import { ProgramDetail } from './pages/ProgramDetail';
import { Fundamentals } from './pages/Fundamentals';
import { Progress } from './pages/Progress';
import { Goals } from './pages/Goals';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </PlayerProvider>
  );
}

