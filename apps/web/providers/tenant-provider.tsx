'use client';

import { createContext, useContext, type ReactNode } from 'react';

type TenantContextValue = { tenantId: string; tenantName: string; country: string };
const TenantContext = createContext<TenantContextValue>({ tenantId: 'tenant-foundation', tenantName: 'NEXORA Global', country: 'US' });
export function TenantProvider({ children }: { children: ReactNode }) { return <TenantContext.Provider value={{ tenantId: 'tenant-foundation', tenantName: 'NEXORA Global', country: 'US' }}>{children}</TenantContext.Provider>; }
export function useTenant() { return useContext(TenantContext); }
