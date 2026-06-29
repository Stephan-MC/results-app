import React, { useState } from 'react';
import { SubjectResult } from '../data/academicData';
import { motion } from 'motion/react';

interface PerformanceChartProps {
  results: SubjectResult[];
  classAverages: { [subjectName: string]: number };
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ results, classAverages }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max score is 100
  const maxScore = 100;

  // X coordinate calculation
  const barSpacing = chartWidth / results.length;
  const barWidth = Math.min(24, barSpacing * 0.35);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs" id="performance-chart-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900" id="chart-title">Analyse des Performances par Matière</h3>
          <p className="text-xs text-gray-500 mt-0.5">Comparaison des notes de l'élève par rapport à la moyenne de la classe (Max 100)</p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center space-x-4 text-xs font-medium" id="chart-legends">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-xs bg-indigo-600 mr-2 block"></span>
            <span className="text-gray-700">Élève</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-xs bg-slate-300 mr-2 block"></span>
            <span className="text-gray-700">Moyenne de la Classe</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
          id="academic-svg-chart"
        >
          {/* Y-Axis Grid Lines */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = paddingTop + chartHeight - (tick / maxScore) * chartHeight;
            return (
              <g key={tick} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] fill-gray-400 font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Bars and labels */}
          {results.map((res, index) => {
            const classAvg = classAverages[res.name] || 75; // fallback average if missing
            const xCenter = paddingLeft + (index * barSpacing) + (barSpacing / 2);
            
            // Student Bar
            const studentBarHeight = (res.totalMarks / maxScore) * chartHeight;
            const studentY = paddingTop + chartHeight - studentBarHeight;
            const studentX = xCenter - barWidth - 2;

            // Class Average Bar
            const avgBarHeight = (classAvg / maxScore) * chartHeight;
            const avgY = paddingTop + chartHeight - avgBarHeight;
            const avgX = xCenter + 2;

            const isHovered = hoveredBar === index;

            return (
              <g
                key={res.code}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                className="cursor-pointer"
                id={`chart-group-${res.code}`}
              >
                {/* Background Hover Highlight */}
                <rect
                  x={paddingLeft + (index * barSpacing) + 4}
                  y={paddingTop - 10}
                  width={barSpacing - 8}
                  height={chartHeight + 20}
                  fill={isHovered ? "rgba(99, 102, 241, 0.03)" : "transparent"}
                  rx="6"
                  className="transition-colors duration-200"
                />

                {/* Class Average Bar */}
                <rect
                  x={avgX}
                  y={avgY}
                  width={barWidth}
                  height={avgBarHeight}
                  fill="#cbd5e1"
                  rx="4"
                  className="transition-all duration-300"
                />

                {/* Student Score Bar */}
                <rect
                  x={studentX}
                  y={studentY}
                  width={barWidth}
                  height={studentBarHeight}
                  fill={isHovered ? "#4f46e5" : "#6366f1"}
                  rx="4"
                  className="transition-all duration-300"
                />

                {/* Value labels on top of bars when hovered */}
                {isHovered && (
                  <g className="transition-opacity duration-200">
                    {/* Student Score Badge */}
                    <rect
                      x={studentX - 8}
                      y={studentY - 22}
                      width={barWidth + 16}
                      height={18}
                      fill="#1e1b4b"
                      rx="3"
                    />
                    <text
                      x={studentX + barWidth / 2}
                      y={studentY - 9}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-white font-bold"
                    >
                      {res.totalMarks}
                    </text>

                    {/* Class Avg Badge */}
                    <rect
                      x={avgX - 8}
                      y={avgY - 22}
                      width={barWidth + 16}
                      height={18}
                      fill="#334155"
                      rx="3"
                    />
                    <text
                      x={avgX + barWidth / 2}
                      y={avgY - 9}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-white font-bold"
                    >
                      {classAvg}
                    </text>
                  </g>
                )}

                {/* Subject Label (rotated slightly for readability if needed, or straight) */}
                <text
                  x={xCenter}
                  y={paddingTop + chartHeight + 20}
                  textAnchor="middle"
                  className="font-sans text-[11px] fill-gray-500 font-medium"
                >
                  {res.name.length > 12 ? `${res.name.substring(0, 10)}..` : res.name}
                </text>
                
                {/* Subject Code (Subtext) */}
                <text
                  x={xCenter}
                  y={paddingTop + chartHeight + 32}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-gray-400"
                >
                  {res.code}
                </text>
              </g>
            );
          })}

          {/* X-Axis Baseline Line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Visual Insight Footer */}
      {hoveredBar !== null && (
        <div className="mt-2 bg-indigo-50/50 rounded-lg p-3 text-xs text-indigo-900 border border-indigo-50 flex items-center justify-between transition-all duration-300">
          <div>
            <span className="font-semibold">{results[hoveredBar].name} ({results[hoveredBar].code}) :</span>{' '}
            <span>
              L'élève a obtenu <strong className="font-semibold text-indigo-700">{results[hoveredBar].totalMarks}/100</strong> (Note continue : {results[hoveredBar].internalMarks}, Examen : {results[hoveredBar].examMarks})
            </span>
          </div>
          <div>
            <span className="text-gray-500">Moy. Classe :</span>{' '}
            <strong className="text-slate-700 font-semibold">{classAverages[results[hoveredBar].name] || 75}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
