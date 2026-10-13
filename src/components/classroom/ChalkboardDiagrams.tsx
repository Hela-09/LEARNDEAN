import React from 'react';
import { ChalkboardDiagram } from '../../types/classroom';

interface ChalkboardDiagramsProps {
  diagram: ChalkboardDiagram;
  progress?: number; // 0 to 1 for animated drawing
}

export default function ChalkboardDiagrams({ diagram, progress = 1 }: ChalkboardDiagramsProps) {
  const { type, caption, labels = [], equation } = diagram;

  // Chalk stroke styles
  const chalkStroke = '#f8fafc'; // Chalk white
  const chalkAccent = '#fef08a'; // Chalk yellow
  const chalkCyan = '#7dd3fc';   // Chalk cyan
  const chalkPink = '#fca5a5';   // Chalk pink

  // Render specific diagram based on type
  const renderDiagramContent = () => {
    switch (type) {
      case 'free_body_diagram':
        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-[320px] mx-auto filter drop-shadow">
            {/* Ground surface with chalk hatch lines */}
            <line x1="40" y1="150" x2="280" y2="150" stroke={chalkStroke} strokeWidth="2.5" strokeDasharray="6 3" />
            <line x1="60" y1="150" x2="45" y2="165" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="110" y1="150" x2="95" y2="165" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="160" y1="150" x2="145" y2="165" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="210" y1="150" x2="195" y2="165" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="260" y1="150" x2="245" y2="165" stroke={chalkStroke} strokeWidth="1.5" />

            {/* Mass Block */}
            <rect
              x="120"
              y="90"
              width="80"
              height="60"
              fill="rgba(255,255,255,0.06)"
              stroke={chalkAccent}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              rx="4"
            />
            <text x="160" y="125" textAnchor="middle" fill={chalkAccent} className="font-mono text-sm font-bold">
              m
            </text>

            {/* Normal Force vector (Up) */}
            <line x1="160" y1="90" x2="160" y2="35" stroke={chalkCyan} strokeWidth="2.5" />
            <polygon points="160,25 154,40 166,40" fill={chalkCyan} />
            <text x="175" y="42" fill={chalkCyan} className="font-mono text-xs font-bold">
              {labels[0] || 'F_N (Normal)'}
            </text>

            {/* Weight / Gravity vector (Down) */}
            <line x1="160" y1="150" x2="160" y2="205" stroke={chalkPink} strokeWidth="2.5" />
            <polygon points="160,215 154,200 166,200" fill={chalkPink} />
            <text x="175" y="205" fill={chalkPink} className="font-mono text-xs font-bold">
              {labels[1] || 'W = mg (Weight)'}
            </text>

            {/* Applied Force vector (Right) */}
            <line x1="200" y1="120" x2="265" y2="120" stroke={chalkAccent} strokeWidth="2.5" />
            <polygon points="275,120 260,114 260,126" fill={chalkAccent} />
            <text x="275" y="112" fill={chalkAccent} className="font-mono text-xs font-bold">
              {labels[2] || 'F_app'}
            </text>

            {/* Friction vector (Left) */}
            <line x1="120" y1="140" x2="70" y2="140" stroke={chalkStroke} strokeWidth="2" strokeDasharray="3 2" />
            <polygon points="60,140 75,135 75,145" fill={chalkStroke} />
            <text x="45" y="132" fill={chalkStroke} className="font-mono text-xs">
              {labels[3] || 'f_k'}
            </text>
          </svg>
        );

      case 'coordinate_graph':
        return (
          <svg viewBox="0 0 320 200" className="w-full max-w-[320px] mx-auto filter drop-shadow">
            {/* Coordinate axes */}
            <line x1="50" y1="170" x2="290" y2="170" stroke={chalkStroke} strokeWidth="2" />
            <polygon points="295,170 285,165 285,175" fill={chalkStroke} />
            <text x="290" y="190" fill={chalkStroke} className="font-mono text-xs font-bold">
              x (time / input)
            </text>

            <line x1="60" y1="180" x2="60" y2="20" stroke={chalkStroke} strokeWidth="2" />
            <polygon points="60,15 55,25 65,25" fill={chalkStroke} />
            <text x="40" y="25" fill={chalkStroke} className="font-mono text-xs font-bold">
              y
            </text>

            {/* Grid ticks */}
            <line x1="120" y1="167" x2="120" y2="173" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="180" y1="167" x2="180" y2="173" stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="240" y1="167" x2="240" y2="173" stroke={chalkStroke} strokeWidth="1.5" />

            {/* Dynamic Curve (e.g. Parabola / Kinematics curve) */}
            <path
              d="M 60,170 Q 150,30 260,165"
              fill="none"
              stroke={chalkAccent}
              strokeWidth="3"
              strokeDasharray="6 2"
            />

            {/* Peak vertex point */}
            <circle cx="150" cy="55" r="4.5" fill={chalkPink} stroke={chalkStroke} strokeWidth="1.5" />
            <line x1="150" y1="55" x2="150" y2="170" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
            <text x="160" y="52" fill={chalkPink} className="font-mono text-xs font-bold">
              {labels[0] || 'Peak / Vertex'}
            </text>

            {/* Tangent slope line */}
            <line x1="100" y1="120" x2="190" y2="40" stroke={chalkCyan} strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="195" y="45" fill={chalkCyan} className="font-mono text-[10px]">
              slope = dy/dx
            </text>
          </svg>
        );

      case 'geometry':
        return (
          <svg viewBox="0 0 320 200" className="w-full max-w-[320px] mx-auto filter drop-shadow">
            {/* Right Triangle */}
            <polygon
              points="70,160 250,160 70,40"
              fill="rgba(125,211,252,0.06)"
              stroke={chalkCyan}
              strokeWidth="2.5"
              strokeDasharray="5 2"
            />
            {/* Right angle symbol */}
            <rect x="70" y="145" width="15" height="15" fill="none" stroke={chalkStroke} strokeWidth="1.5" />

            {/* Labels */}
            <text x="160" y="180" textAnchor="middle" fill={chalkAccent} className="font-mono text-xs font-bold">
              {labels[0] || 'Adjacent (b)'}
            </text>
            <text x="35" y="105" textAnchor="middle" fill={chalkPink} className="font-mono text-xs font-bold">
              {labels[1] || 'Opposite (a)'}
            </text>
            <text x="175" y="90" textAnchor="middle" fill={chalkStroke} className="font-mono text-xs font-bold">
              {labels[2] || 'Hypotenuse (c)'}
            </text>

            {/* Angle theta arc */}
            <path d="M 220,160 A 30 30 0 0 0 235,148" fill="none" stroke={chalkAccent} strokeWidth="2" />
            <text x="210" y="152" fill={chalkAccent} className="font-mono text-xs font-bold">
              θ
            </text>
          </svg>
        );

      case 'chemical_reaction':
        return (
          <svg viewBox="0 0 320 180" className="w-full max-w-[320px] mx-auto filter drop-shadow">
            {/* Reaction Coordinate Curve */}
            <line x1="40" y1="150" x2="280" y2="150" stroke={chalkStroke} strokeWidth="2" />
            <line x1="40" y1="160" x2="40" y2="30" stroke={chalkStroke} strokeWidth="2" />
            <text x="260" y="170" fill={chalkStroke} className="font-mono text-[11px]">Reaction Progress →</text>
            <text x="20" y="25" fill={chalkStroke} className="font-mono text-[11px]">Energy</text>

            {/* Activation Energy Hill */}
            <path
              d="M 50,110 L 90,110 Q 150,30 200,135 L 270,135"
              fill="none"
              stroke={chalkAccent}
              strokeWidth="2.8"
            />

            {/* Reactants & Products level */}
            <text x="65" y="100" fill={chalkCyan} className="font-mono text-xs font-bold">
              {labels[0] || 'Reactants'}
            </text>
            <text x="235" y="125" fill={chalkPink} className="font-mono text-xs font-bold">
              {labels[1] || 'Products'}
            </text>

            {/* Activation energy barrier arrow */}
            <line x1="150" y1="110" x2="150" y2="40" stroke={chalkStroke} strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="155" y="65" fill={chalkStroke} className="font-mono text-[11px] font-bold">
              {labels[2] || 'E_a (Activation Energy)'}
            </text>
          </svg>
        );

      case 'circuit':
        return (
          <svg viewBox="0 0 320 180" className="w-full max-w-[320px] mx-auto filter drop-shadow">
            {/* Circuit loop */}
            <rect x="60" y="40" width="200" height="100" fill="none" stroke={chalkStroke} strokeWidth="2.5" />

            {/* Battery on left */}
            <rect x="52" y="75" width="16" height="30" fill="#1b2a24" />
            <line x1="50" y1="80" x2="70" y2="80" stroke={chalkCyan} strokeWidth="3" />
            <line x1="55" y1="100" x2="65" y2="100" stroke={chalkCyan} strokeWidth="2" />
            <text x="35" y="94" fill={chalkCyan} className="font-mono text-xs font-bold">V (+/-)</text>

            {/* Resistor on top */}
            <rect x="130" y="32" width="60" height="16" fill="#1b2a24" />
            <path d="M 130,40 L 138,32 L 146,48 L 154,32 L 162,48 L 170,32 L 178,48 L 186,40 L 190,40" fill="none" stroke={chalkAccent} strokeWidth="2.5" />
            <text x="160" y="24" textAnchor="middle" fill={chalkAccent} className="font-mono text-xs font-bold">
              {labels[0] || 'Resistor (R)'}
            </text>

            {/* Current Arrow (I) */}
            <polygon points="220,40 210,35 210,45" fill={chalkPink} />
            <text x="215" y="26" fill={chalkPink} className="font-mono text-xs font-bold">I →</text>
          </svg>
        );

      case 'flowchart':
      default:
        return (
          <div className="w-full py-2 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <div className="px-3.5 py-1.5 rounded-lg border-2 border-dashed border-yellow-200/80 bg-white/5 text-yellow-200 font-mono text-xs sm:text-sm font-bold shadow">
                {labels[0] || '1. Given Input'}
              </div>
              <span className="text-white/70 font-mono font-bold">➔</span>
              <div className="px-3.5 py-1.5 rounded-lg border-2 border-dashed border-cyan-300/80 bg-white/5 text-cyan-200 font-mono text-xs sm:text-sm font-bold shadow">
                {labels[1] || '2. Governing Law'}
              </div>
              <span className="text-white/70 font-mono font-bold">➔</span>
              <div className="px-3.5 py-1.5 rounded-lg border-2 border-dashed border-emerald-300/80 bg-white/5 text-emerald-200 font-mono text-xs sm:text-sm font-bold shadow">
                {labels[2] || '3. Solution'}
              </div>
            </div>
            {equation && (
              <div className="mt-1 px-4 py-1.5 rounded-xl border border-white/20 bg-white/5 text-white font-mono text-sm tracking-wide">
                {equation}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-full my-3 p-3 rounded-xl bg-black/25 border border-white/15 backdrop-blur-xs flex flex-col items-center justify-center transition-all">
      <div className="w-full flex items-center justify-between px-2 mb-1.5 text-[11px] font-mono tracking-wider uppercase text-white/60">
        <span>[ CHALKBOARD DIAGRAM ]</span>
        <span className="text-yellow-200/80">{type.replace(/_/g, ' ')}</span>
      </div>

      <div className="w-full flex items-center justify-center overflow-x-auto py-1">
        {renderDiagramContent()}
      </div>

      {caption && (
        <p className="mt-2 text-center text-xs sm:text-sm font-mono text-white/80 italic px-2">
          ✎ {caption}
        </p>
      )}
    </div>
  );
}
