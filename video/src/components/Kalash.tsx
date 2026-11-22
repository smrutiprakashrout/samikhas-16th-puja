import type React from 'react';
import { seg, sine } from '../lib/anim';
import { E } from '../theme';

// Inline conversion of public/svg/kalash.svg. Every id and path is kept as authored.
const LEAF_START: Record<number, number> = { 1: 50, 2: 50, 3: 44, 4: 44, 5: 38, 6: 38 };
const LEAF_PHASE: Record<number, number> = { 1: 0, 2: 1 / 6, 3: 2 / 6, 4: 3 / 6, 5: 4 / 6, 6: 5 / 6 };

export const Kalash: React.FC<{ frame: number }> = ({ frame }) => {
  const baseP = seg(frame, 4, 20, E.out);
  const bodyP = seg(frame, 10, 34, E.out);
  const threadP = seg(frame, 30, 42, E.out);
  const lipP = seg(frame, 28, 38, E.out);
  const cocoP = seg(frame, 34, 48, E.out);
  const float = frame >= 80 ? sine(frame, 150) * 3 : 0;
  const shineOp = 0.525 + 0.175 * sine(frame, 100);

  const leaf = (n: number, angle: number) => {
    const start = LEAF_START[n];
    const p = seg(frame, start, start + 24, E.out);
    const op = seg(frame, start, start + 8, E.out);
    const sway = frame >= 80 ? sine(frame, 120, LEAF_PHASE[n]) * 1.2 : 0;
    return { opacity: op, transform: `translate(100 94) rotate(${angle * p + sway})` };
  };

  return (
    <svg viewBox="0 0 200 260" width="200" height="260" style={{ width: '100%', height: '100%', overflow: 'visible' }}>

  
  <defs>
    <linearGradient id="k-brass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#9A7425"/>
      <stop offset=".26" stopColor="#F0D58A"/>
      <stop offset=".52" stopColor="#C9A24B"/>
      <stop offset="1" stopColor="#9A7425"/>
    </linearGradient>
    <linearGradient id="k-brass-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F0D58A"/>
      <stop offset="1" stopColor="#C9A24B"/>
    </linearGradient>
    <linearGradient id="k-leaf-g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#5D695D"/>
      <stop offset="1" stopColor="#AAA06D"/>
    </linearGradient>
    <radialGradient id="k-coco-g" cx=".36" cy=".3" r=".8">
      <stop offset="0" stopColor="#C79A5B"/>
      <stop offset=".55" stopColor="#A8793F"/>
      <stop offset="1" stopColor="#6E4C28"/>
    </radialGradient>
    <clipPath id="k-body-clip">
      <path d="M82 97 L82 114 C82 124 52 134 46 164 C42 190 62 222 100 224 C138 222 158 190 154 164 C148 134 118 124 118 114 L118 97 Z"/>
    </clipPath>
      <clipPath id="k-reveal">
      <rect x="0" y={240 - 150 * bodyP} width="200" height={20 + 150 * bodyP}/>
    </clipPath>
  </defs>
  <g transform={`translate(0 ${float})`}>

  
  <g id="k-base" opacity={baseP} transform={`translate(100 0) scale(${0.5 + 0.5 * baseP} 1) translate(-100 0)`}>
    <ellipse cx="100" cy="240" rx="66" ry="9" fill="#D8B684"/>
    <ellipse cx="100" cy="238" rx="66" ry="9" fill="#F4E4CC" stroke="#A8793F" strokeWidth="1"/>
    <ellipse cx="100" cy="238" rx="50" ry="6" fill="none" stroke="#A8793F" strokeWidth=".7" strokeOpacity=".7"/>
    <path d="M78 224 L73 237 L127 237 L122 224 Z" fill="url(#k-brass)" stroke="#6E4C28" strokeWidth="1" strokeLinejoin="round"/>
  </g>

  
  <g id="k-leaves">
    <g id="k-leaf-1" {...leaf(1, -80)}><path d="M0 0C10 -14 12 -48 0 -80C-12 -48 -10 -14 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -70" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
    <g id="k-leaf-2" {...leaf(2, 80)}><path d="M0 0C10 -14 12 -48 0 -80C-12 -48 -10 -14 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -70" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
    <g id="k-leaf-3" {...leaf(3, -52)}><path d="M0 0C11 -16 13 -54 0 -90C-13 -54 -11 -16 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -80" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
    <g id="k-leaf-4" {...leaf(4, 52)}><path d="M0 0C11 -16 13 -54 0 -90C-13 -54 -11 -16 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -80" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
    <g id="k-leaf-5" {...leaf(5, -24)}><path d="M0 0C11 -17 13 -58 0 -98C-13 -58 -11 -17 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -88" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
    <g id="k-leaf-6" {...leaf(6, 24)}><path d="M0 0C11 -17 13 -58 0 -98C-13 -58 -11 -17 0 0Z" fill="url(#k-leaf-g)" stroke="#5D695D" strokeWidth=".8"/><path d="M0 -4L0 -88" stroke="#F4E4CC" strokeOpacity=".55" strokeWidth=".8" fill="none"/></g>
  </g>

  
  <g id="k-coconut" opacity={cocoP} transform={`translate(0 ${-30 * (1 - cocoP)}) translate(100 76) scale(${0.92 + 0.08 * cocoP}) translate(-100 -76)`}>
    <g fill="none" stroke="#6E4C28" strokeLinecap="round" strokeWidth="1.3">
      <path d="M100 52 C95 45 90 41 85 40"/><path d="M100 52 C97 44 94 38 92 33"/>
      <path d="M100 52 C100 44 100 38 100 31"/><path d="M100 52 C103 44 106 38 108 33"/>
      <path d="M100 52 C105 45 110 41 115 40"/>
    </g>
    <ellipse cx="100" cy="76" rx="22" ry="26" fill="url(#k-coco-g)" stroke="#6E4C28" strokeWidth="1"/>
    <circle cx="94" cy="62" r="1.8" fill="#6E4C28" fillOpacity=".8"/>
    <circle cx="106" cy="62" r="1.8" fill="#6E4C28" fillOpacity=".8"/>
    <circle cx="100" cy="67" r="1.8" fill="#6E4C28" fillOpacity=".8"/>
    <path d="M88 66 C86 76 90 88 96 96" fill="none" stroke="#F4E4CC" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round"/>
  </g>

  
  <g id="k-lip" opacity={lipP} transform={`translate(0 ${-12 * (1 - lipP)})`}>
    <rect x="68" y="88" width="64" height="10" rx="5" fill="url(#k-brass)" stroke="#6E4C28" strokeWidth="1"/>
    <path d="M72 92 H128" stroke="#F4E4CC" strokeOpacity=".6" strokeWidth=".8"/>
  </g>
  <g clipPath="url(#k-reveal)">
    <g id="k-body">
    <path d="M82 97 L82 114 C82 124 52 134 46 164 C42 190 62 222 100 224 C138 222 158 190 154 164 C148 134 118 124 118 114 L118 97 Z" fill="url(#k-brass)" stroke="#6E4C28" strokeWidth="1.1" strokeLinejoin="round"/>
    <g clipPath="url(#k-body-clip)">
      <path id="k-shine" d="M62 152 C58 172 64 196 78 212" fill="none" stroke="#FFF9EC" strokeOpacity={shineOp} strokeWidth="5" strokeLinecap="round"/>
      <path d="M140 160 C142 178 136 198 124 210" fill="none" stroke="#6E4C28" strokeOpacity=".25" strokeWidth="6" strokeLinecap="round"/>
    </g>
  </g>

  
  <g id="k-bands" clipPath="url(#k-body-clip)" fill="none" stroke="#6E4C28" strokeOpacity=".6" strokeWidth=".9">
    <path d="M52 146 Q100 166 148 146"/>
    <path d="M47 158 Q100 180 153 158" strokeOpacity=".35"/>
    <path d="M46 196 Q100 216 154 196"/>
    <g strokeOpacity=".7" fill="#F4E4CC" fillOpacity=".25">
      <path d="M100 196 C92 188 92 178 100 170 C108 178 108 188 100 196Z"/>
      <path d="M82 192 C73 186 72 176 78 168 C88 172 90 184 82 192Z"/>
      <path d="M118 192 C127 186 128 176 122 168 C112 172 110 184 118 192Z"/>
      <path d="M65 184 C58 176 58 168 62 162 C70 164 72 176 65 184Z"/>
      <path d="M135 184 C142 176 142 168 138 162 C130 164 128 176 135 184Z"/>
    </g>
  </g>
  </g>

  
  <g id="k-thread" fill="none" stroke="#B25D17" strokeWidth="1.5" strokeLinecap="round">
    <path d="M82 104 Q100 110 118 104" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - threadP}/>
    <path d="M82 109 Q100 116 118 109" strokeOpacity=".8" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - threadP}/>
    <path d="M118 109 Q124 118 121 128" strokeWidth="1.2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - threadP}/>
  </g>
  </g>

    </svg>
  );
};
