import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const retailModuleKeys = ['crm', 'sales', 'inventory', 'finance', 'operations', 'intelligence'];
export const retailWidgetKeys = ['revenue', 'customers', 'financials', 'followups', 'stock', 'sales'];
export type RetailPreferences = { version: number; modules: string[]; widgets: string[] };

export function readRetailPreferences(raw: Prisma.JsonValue | undefined): RetailPreferences {
  const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const keys = (input: Prisma.JsonValue | undefined, allowed: string[]) => Array.isArray(input) ? [...new Set(input.filter((key): key is string => typeof key === 'string' && allowed.includes(key)))] : [...allowed];
  return { version: typeof value.version === 'number' && Number.isSafeInteger(value.version) && value.version >= 0 ? value.version : 0, modules: keys(value.modules, retailModuleKeys), widgets: keys(value.widgets, retailWidgetKeys) };
}

export function validateRetailPreferences(input: { expectedVersion: number; modules: string[]; widgets: string[] }) {
  if (!Number.isInteger(input.expectedVersion) || input.expectedVersion < 0 || input.expectedVersion > 2147483646) throw new BadRequestException('A valid preferences version is required');
  for (const [values, allowed] of [[input.modules, retailModuleKeys], [input.widgets, retailWidgetKeys]]) {
    if (!Array.isArray(values) || values.length > allowed.length || new Set(values).size !== values.length || values.some(key => !allowed.includes(key))) throw new BadRequestException('Choose unique, supported workspace options');
  }
}
