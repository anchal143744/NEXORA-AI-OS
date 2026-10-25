import type { ShopPreferences } from './shop-preferences';
export type PageResult<T> = { items: T[]; total: number; page: number; limit: number };
export type ShopSettings = { websiteLeadConnection?:{configured:boolean}; invoiceSignatureRegistered?:boolean; aiDraftsConfigured?:boolean; setupComplete?: boolean; profile?: { businessName: string; address?: string; businessPhone?: string; businessEmail?: string; website?: string; sells?: string; buys?: string; taxRegistration?: string; invoiceStyle?: string; invoiceTerms?: string; category: string; countryCode: string; timeZone: string } | null; capabilities?: Record<string, boolean>; preferences?: ShopPreferences; name: string; organizationName: string; tenantId: string; workspaceId: string; organizationId: string; currency: string | null; precision: number | null };
export type Customer = { id: string; name: string; email: string | null; phone: string | null; company: string | null; lifecycleStage: 'lead' | 'customer' };
export type Product = { id: string; name: string; sku: string; unitPrice: string | null; currency: string | null; quantity: string; inventoryValue: string; reorderPoint: string; warehouse: string };
export type FollowUp = { metadata?:{messageDraft?:string}; id: string; title: string; customerId: string; customerName: string; dueAt: string; priority: string; status: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELED' };
export type Expense = { id: string; vendor: string; category: string; description: string | null; amount: string; currency: string; status: string; incurredAt: string };
export type Sale = { id: string; saleKey: string; status: string; currency: string; total: string; createdAt: string; completedAt: string | null; invoiceId: string; lines: { id: string; stockId: string; quantity: string; returnedQuantity: string; unitPrice: string; lineTotal: string }[]; invoice: { id: string; invoiceNumber: string; status: string; total: string; amountDue: string; amountPaid: string; customerId: string | null; metadata: { customerName?: string | null } } };
export type Report = { currency: string; precision: number; from: string; to: string; sales: string; returns: string; recognizedRevenue: string; costOfGoodsSold: string; operatingExpenses: string; grossProfit: string; netProfit: string; cashReceived: string; cashRefunded: string; netCustomerCash: string; dailyMetrics?: { date: string; recognizedRevenue: string; costOfGoodsSold: string; operatingExpenses: string; grossProfit: string; netProfit: string }[]; dailyRevenue: { date: string; amount: string }[]; assumptions: string };
export type Overview = { generatedAt?: string; overdueInvoices?: number; overdueAmount?: string; outOfStock?: number; lowStockItems?: { id: string; name: string; sku: string; warehouse: string; quantity: string; reorderPoint: string }[]; recentLeads?: { id: string; name: string; company: string | null; lifecycleStage: string; createdAt: string }[]; activity?: { id: string; type: string; recordId: string | null; at: string; actor: string }[]; customers?: number; leads?: number; dueFollowUps?: number; products?: number; lowStock?: number; inventoryValue?: string; outstanding?: string; currency: string };
export type Payment = { id: string; amount: string; currency: string; entryType: string; paymentMethod: string; reference: string | null; paidAt: string; metadata: { reason?: string } };
export type Movement = { id: string; quantity: string; movementType: string; occurredAt: string; metadata: { reason?: string; value?: string } };

// Presentation preserves exact decimal strings; accounting stays on the server.
export function moneyLabel(value: string | undefined, currency: string, precision: number) {
  if (value === undefined) return '—';
  const negative = value.startsWith('-');
  const [integer, fraction = ''] = value.replace(/^-/, '').split('.');
  const grouped = BigInt(integer || '0').toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US');
  return `${currency} ${negative ? '−' : ''}${grouped}${precision ? '.' + fraction.padEnd(precision, '0').slice(0, precision) : ''}`;
}
export function dateLabel(value: string | null, timeZone = 'UTC') { return value ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone }).format(new Date(value)) : '—'; }
