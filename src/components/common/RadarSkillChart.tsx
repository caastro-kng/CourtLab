import React from 'react';
import { SkillRating } from '../../types';

interface RadarSkillChartProps {
  skills: SkillRating[];
  size?: number;
}

export const RadarSkillChart: React.FC<RadarSkillChartProps> = ({ skills, size = 380 }) => {
  const center = size / 2;
  const radius = (size / 2) - 50;
  const total = skills.length;

  // Calculate polygon points for grid rings (2, 4, 6, 8, 10)
  const rings = [2, 4, 6, 8, 10];

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate path string for player's skill polygon
  const playerPoints = skills.map((skill, i) => {
    const { x, y } = getCoordinates(i, skill.score);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="Gráfico Radar de Habilidades de Basquete"
      >
        {/* Background circular web / polygon rings */}
        {rings.map((ringValue) => {
          const ringPoints = skills.map((_, i) => {
            const { x, y } = getCoordinates(i, ringValue);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={ringValue}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#1F2630"
                strokeWidth={ringValue === 10 ? '1.5' : '1'}
                strokeDasharray={ringValue === 10 ? 'none' : '3 3'}
              />
              <text
                x={center}
                y={center - (ringValue / 10) * radius - 3}
                fill="#4B5563"
                fontSize="9"
                textAnchor="middle"
                className="font-mono-num font-medium"
              >
                {ringValue}
              </text>
            </g>
          );
        })}

        {/* Spokes (axis lines from center) */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(i, 10);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#191E24"
              strokeWidth="1"
            />
          );
        })}

        {/* Player Skill Polygon Area */}
        <polygon
          points={playerPoints}
          fill="rgba(255, 107, 26, 0.22)"
          stroke="#FF6B1A"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Value Points & Tooltip Dots */}
        {skills.map((skill, i) => {
          const { x, y } = getCoordinates(i, skill.score);
          const labelCoords = getCoordinates(i, 11.4);

          return (
            <g key={skill.key} className="group cursor-pointer">
              {/* Glowing point dot */}
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#FF6B1A"
                stroke="#080A0D"
                strokeWidth="2"
                className="transition-transform group-hover:scale-150"
              />

              {/* Label text */}
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                fill={skill.score >= 7.5 ? '#FF8D4D' : '#9AA1AA'}
                fontSize="10"
                fontWeight={skill.score >= 7.5 ? '700' : '500'}
                textAnchor={labelCoords.x < center - 10 ? 'end' : labelCoords.x > center + 10 ? 'start' : 'middle'}
                dominantBaseline="middle"
                className="transition-colors group-hover:fill-white select-none"
              >
                {skill.name}
              </text>

              {/* Value badge */}
              <text
                x={labelCoords.x}
                y={labelCoords.y + (labelCoords.y > center ? 11 : -11)}
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="700"
                textAnchor={labelCoords.x < center - 10 ? 'end' : labelCoords.x > center + 10 ? 'start' : 'middle'}
                dominantBaseline="middle"
                className="font-mono-num opacity-75 group-hover:opacity-100"
              >
                {skill.score.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
