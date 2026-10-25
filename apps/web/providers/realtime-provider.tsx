'use client';

import { createContext, useContext, type ReactNode } from 'react';

type RealtimeContextValue = { connected: boolean; channels: string[] };
const RealtimeContext = createContext<RealtimeContextValue>({ connected: false, channels: ['workspace','notifications','activity-feed','ai-updates'] });
export function RealtimeProvider({ children }: { children: ReactNode }) { return <RealtimeContext.Provider value={{ connected: false, channels: ['workspace','notifications','activity-feed','ai-updates'] }}>{children}</RealtimeContext.Provider>; }
export function useRealtime() { return useContext(RealtimeContext); }
