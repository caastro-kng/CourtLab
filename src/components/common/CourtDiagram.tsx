import React from 'react';

interface CourtDiagramProps {
  placement?: 'top' | 'wing' | 'corner' | 'paint' | 'full-court' | 'restricted';
  className?: string;
}

export const CourtDiagram: React.FC<CourtDiagramProps> = ({ placement = 'top', className = '' }) => {
  return (
    <div className={`relative bg-[#0D1014] border border-[#1F2630] rounded-lg p-3 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#9AA1AA]">
          Posicionamento em Quadra
        </span>
        <span className="text-[11px] font-semibold text-[#FF6B1A] uppercase">
          {placement === 'top' && 'Topo da Cabeça (Top of Key)'}
          {placement === 'wing' && 'Asa / Lateral (Wing)'}
          {placement === 'corner' && 'Zona Morta (Corner)'}
          {placement === 'paint' && 'Garrafão (The Paint)'}
          {placement === 'restricted' && 'Área Restrita / Aro'}
          {placement === 'full-court' && 'Quadra Inteira'}
        </span>
      </div>

      <svg viewBox="0 0 300 200" className="w-full h-auto bg-[#080A0D] rounded border border-[#191E24]">
        {/* Court Outline (Half court) */}
        <rect x="10" y="10" width="280" height="180" fill="none" stroke="#262F3D" strokeWidth="2" />

        {/* Half court line / top boundary */}
        <line x1="10" y1="190" x2="290" y2="190" stroke="#262F3D" strokeWidth="1.5" />
        <circle cx="150" cy="190" r="35" fill="none" stroke="#262F3D" strokeWidth="1.5" />

        {/* Paint / Key area */}
        <rect x="110" y="10" width="80" height="95" fill="rgba(255, 107, 26, 0.04)" stroke="#262F3D" strokeWidth="1.5" />
        <circle cx="150" cy="105" r="35" fill="none" stroke="#262F3D" strokeWidth="1.5" />

        {/* Backboard & Rim */}
        <line x1="130" y1="20" x2="170" y2="20" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="150" cy="27" r="8" fill="none" stroke="#FF6B1A" strokeWidth="2" />
        <path d="M 135 20 A 15 15 0 0 0 165 20" fill="none" stroke="#262F3D" strokeWidth="1" />

        {/* 3-Point Arc */}
        <path
          d="M 30 10 L 30 50 A 120 120 0 0 0 270 50 L 270 10"
          fill="none"
          stroke="#262F3D"
          strokeWidth="1.5"
        />

        {/* Placement Highlight Pulse Marker */}
        {placement === 'top' && (
          <g>
            <circle cx="150" cy="150" r="14" fill="rgba(255, 107, 26, 0.3)" className="animate-ping" />
            <circle cx="150" cy="150" r="8" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="150" y="172" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">INÍCIO DO DRILL</text>
          </g>
        )}

        {placement === 'wing' && (
          <g>
            <circle cx="65" cy="100" r="14" fill="rgba(255, 107, 26, 0.3)" className="animate-ping" />
            <circle cx="65" cy="100" r="8" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="65" y="125" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">WING DIR/ESQ</text>
          </g>
        )}

        {placement === 'corner' && (
          <g>
            <circle cx="30" cy="30" r="14" fill="rgba(255, 107, 26, 0.3)" className="animate-ping" />
            <circle cx="30" cy="30" r="8" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="55" y="34" fill="#FFFFFF" fontSize="9" fontWeight="700">CORNER 3PT</text>
          </g>
        )}

        {placement === 'paint' && (
          <g>
            <circle cx="150" cy="70" r="14" fill="rgba(255, 107, 26, 0.3)" className="animate-ping" />
            <circle cx="150" cy="70" r="8" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="150" y="90" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">GARRAFÃO</text>
          </g>
        )}

        {placement === 'restricted' && (
          <g>
            <circle cx="150" cy="30" r="14" fill="rgba(255, 107, 26, 0.3)" className="animate-ping" />
            <circle cx="150" cy="30" r="8" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="2" />
            <text x="150" y="50" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">SOB O ARO</text>
          </g>
        )}

        {placement === 'full-court' && (
          <g>
            <line x1="30" y1="170" x2="270" y2="30" stroke="#FF6B1A" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="30" cy="170" r="6" fill="#FF6B1A" />
            <circle cx="270" cy="30" r="6" fill="#FF6B1A" />
            <text x="150" y="105" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">DESLOCAMENTO COMPLETO</text>
          </g>
        )}
      </svg>
    </div>
  );
};
