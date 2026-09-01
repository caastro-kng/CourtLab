import { SkillCategory } from '../types';

type CategoryVisual = {
  accent: string;
  soft: string;
  border: string;
  glow: string;
  label: string;
};

const VISUALS: Record<SkillCategory, CategoryVisual> = {
  'ball-handle': {
    accent: '#7DD3FC',
    soft: 'rgba(125, 211, 252, 0.10)',
    border: 'rgba(125, 211, 252, 0.24)',
    glow: 'rgba(125, 211, 252, 0.16)',
    label: 'Criação'
  },
  shooting: {
    accent: '#F6C453',
    soft: 'rgba(246, 196, 83, 0.10)',
    border: 'rgba(246, 196, 83, 0.24)',
    glow: 'rgba(246, 196, 83, 0.16)',
    label: 'Scoring'
  },
  finishing: {
    accent: '#F59E7A',
    soft: 'rgba(245, 158, 122, 0.10)',
    border: 'rgba(245, 158, 122, 0.24)',
    glow: 'rgba(245, 158, 122, 0.16)',
    label: 'Scoring'
  },
  footwork: {
    accent: '#93C5FD',
    soft: 'rgba(147, 197, 253, 0.10)',
    border: 'rgba(147, 197, 253, 0.24)',
    glow: 'rgba(147, 197, 253, 0.16)',
    label: 'Movimento'
  },
  passing: {
    accent: '#67E8F9',
    soft: 'rgba(103, 232, 249, 0.09)',
    border: 'rgba(103, 232, 249, 0.22)',
    glow: 'rgba(103, 232, 249, 0.14)',
    label: 'Criação'
  },
  'pick-and-roll': {
    accent: '#C4B5FD',
    soft: 'rgba(196, 181, 253, 0.10)',
    border: 'rgba(196, 181, 253, 0.24)',
    glow: 'rgba(196, 181, 253, 0.16)',
    label: 'Leitura'
  },
  defense: {
    accent: '#6EE7B7',
    soft: 'rgba(110, 231, 183, 0.09)',
    border: 'rgba(110, 231, 183, 0.22)',
    glow: 'rgba(110, 231, 183, 0.14)',
    label: 'Defesa'
  },
  'off-ball': {
    accent: '#D8B4FE',
    soft: 'rgba(216, 180, 254, 0.09)',
    border: 'rgba(216, 180, 254, 0.22)',
    glow: 'rgba(216, 180, 254, 0.14)',
    label: 'Leitura'
  },
  'post-game': {
    accent: '#FDBA74',
    soft: 'rgba(253, 186, 116, 0.09)',
    border: 'rgba(253, 186, 116, 0.22)',
    glow: 'rgba(253, 186, 116, 0.14)',
    label: 'Scoring'
  },
  athletic: {
    accent: '#BEF264',
    soft: 'rgba(190, 242, 100, 0.08)',
    border: 'rgba(190, 242, 100, 0.20)',
    glow: 'rgba(190, 242, 100, 0.12)',
    label: 'Performance'
  }
};

const COMPLETE_VISUAL: CategoryVisual = {
  accent: '#FF6B1A',
  soft: 'rgba(255, 107, 26, 0.10)',
  border: 'rgba(255, 107, 26, 0.24)',
  glow: 'rgba(255, 107, 26, 0.16)',
  label: 'Completo'
};

export const getCategoryVisual = (category: SkillCategory | 'complete'): CategoryVisual =>
  category === 'complete' ? COMPLETE_VISUAL : VISUALS[category];
