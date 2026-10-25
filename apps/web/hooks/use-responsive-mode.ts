'use client';
import { useEffect, useState } from 'react';
export type ResponsiveMode = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export function useResponsiveMode() { const [mode, setMode] = useState<ResponsiveMode>('desktop'); useEffect(() => { const update = () => { const width = window.innerWidth; setMode(width < 640 ? 'mobile' : width < 1024 ? 'tablet' : width < 1440 ? 'laptop' : 'desktop'); }; update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []); return mode; }
