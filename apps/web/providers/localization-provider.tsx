'use client';

import { createContext, useContext, type ReactNode } from 'react';

type LocalizationContextValue = { locale: string; timezone: string; currency: string };
const LocalizationContext = createContext<LocalizationContextValue>({ locale: 'en-US', timezone: 'UTC', currency: 'USD' });
export function LocalizationProvider({ children }: { children: ReactNode }) { return <LocalizationContext.Provider value={{ locale: 'en-US', timezone: 'UTC', currency: 'USD' }}>{children}</LocalizationContext.Provider>; }
export function useLocalization() { return useContext(LocalizationContext); }
