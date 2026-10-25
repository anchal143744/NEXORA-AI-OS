'use client';
import { useEffect } from 'react';
export function useCommandShortcut(callback: () => void) { useEffect(() => { const onKey = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); callback(); } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [callback]); }
